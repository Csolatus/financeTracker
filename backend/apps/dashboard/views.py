from datetime import date

from django.db.models import Sum, Count
from django.db.models.functions import TruncMonth
from rest_framework import views, permissions
from rest_framework.response import Response

from apps.transactions.models import Transaction


class DashboardSummaryView(views.APIView):
    """
    GET /api/dashboard/summary/
    Retourne un résumé du mois courant pour l'utilisateur connecté :
      - Totaux par type de transaction
      - Solde net (revenus - dépenses)
      - Répartition des dépenses par catégorie
      - Évolution mensuelle sur les 6 derniers mois
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        today = date.today()
        user = request.user

        # ── Base queryset du mois courant ──────────────────────────────────────
        current_month_qs = Transaction.objects.filter(
            user=user,
            date__year=today.year,
            date__month=today.month,
        )

        # ── Totaux par type ────────────────────────────────────────────────────
        totals_by_type = (
            current_month_qs
            .values("transaction_type")
            .annotate(total=Sum("amount"))
        )
        totals = {row["transaction_type"]: float(row["total"]) for row in totals_by_type}

        income  = totals.get("INCOME", 0)
        expense = totals.get("EXPENSE", 0)

        # ── Dépenses par catégorie (pour le graphique camembert) ───────────────
        expenses_by_category = (
            current_month_qs
            .filter(transaction_type="EXPENSE")
            .values("category__name", "category__icon")
            .annotate(total=Sum("amount"))
            .order_by("-total")
        )

        # ── Évolution sur les 6 derniers mois (pour le graphique courbe) ───────
        monthly_evolution = (
            Transaction.objects
            .filter(user=user)
            .annotate(month=TruncMonth("date"))
            .values("month", "transaction_type")
            .annotate(total=Sum("amount"))
            .order_by("month")
        )

        # Restructure en {mois: {INCOME: x, EXPENSE: y, …}}
        evolution = {}
        for row in monthly_evolution:
            key = row["month"].strftime("%Y-%m")
            if key not in evolution:
                evolution[key] = {}
            evolution[key][row["transaction_type"]] = float(row["total"])

        return Response({
            "period": {"year": today.year, "month": today.month},
            "totals": totals,
            "balance": round(income - expense, 2),
            "expenses_by_category": [
                {
                    "category": row["category__name"],
                    "icon": row["category__icon"],
                    "total": float(row["total"]),
                }
                for row in expenses_by_category
            ],
            "monthly_evolution": [
                {"month": month, **types}
                for month, types in evolution.items()
            ],
        })
