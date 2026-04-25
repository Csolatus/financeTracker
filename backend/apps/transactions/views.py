import csv

from django.http import HttpResponse
from rest_framework import generics, permissions, views, status
from rest_framework.response import Response

from .filters import TransactionFilter
from .models import Transaction
from .serializers import TransactionSerializer


class TransactionListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/transactions/  → liste les transactions de l'utilisateur connecté.
    POST /api/transactions/  → crée une nouvelle transaction.

    Filtres disponibles : ?month=YYYY-MM  ?category=id  ?transaction_type=TYPE
    Tri disponible      : ?ordering=date  ?ordering=-amount
    """

    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_class = TransactionFilter
    ordering_fields = ["date", "amount", "created_at"]
    ordering = ["-date"]

    def get_queryset(self):
        # Un utilisateur ne voit que ses propres transactions
        return Transaction.objects.filter(user=self.request.user).select_related("category")


class TransactionDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/transactions/{id}/  → détail d'une transaction.
    PUT    /api/transactions/{id}/  → mise à jour complète.
    PATCH  /api/transactions/{id}/  → mise à jour partielle.
    DELETE /api/transactions/{id}/  → suppression.
    """

    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Empêche un utilisateur d'accéder aux transactions d'un autre
        return Transaction.objects.filter(user=self.request.user).select_related("category")


class TransactionExportView(views.APIView):
    """
    GET /api/transactions/export/
    Exporte toutes les transactions de l'utilisateur en CSV.
    Supporte les mêmes filtres que la liste (?month=, ?category=, ?transaction_type=).
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        queryset = Transaction.objects.filter(user=request.user).select_related("category")

        # Applique les mêmes filtres que la liste
        filterset = TransactionFilter(request.GET, queryset=queryset)
        if filterset.is_valid():
            queryset = filterset.qs

        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="transactions.csv"'

        writer = csv.writer(response)
        writer.writerow(["Date", "Titre", "Type", "Montant", "Devise", "Catégorie", "Récurrent", "Notes"])

        for t in queryset.order_by("-date"):
            writer.writerow([
                t.date,
                t.title,
                t.get_transaction_type_display(),
                t.amount,
                t.currency,
                t.category.name,
                "Oui" if t.is_recurring else "Non",
                t.notes,
            ])

        return response
