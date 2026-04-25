import django_filters

from .models import Transaction


class TransactionFilter(django_filters.FilterSet):
    """
    Filtres disponibles sur GET /api/transactions/
    Exemples :
        ?month=2026-03
        ?category=2
        ?transaction_type=EXPENSE
        ?month=2026-03&category=2&transaction_type=EXPENSE
    """

    month = django_filters.CharFilter(method="filter_by_month", label="Mois (YYYY-MM)")

    def filter_by_month(self, queryset, name, value):
        """Filtre les transactions dont la date correspond au mois YYYY-MM."""
        try:
            year, month = value.split("-")
            return queryset.filter(date__year=int(year), date__month=int(month))
        except (ValueError, AttributeError):
            return queryset.none()

    class Meta:
        model = Transaction
        fields = {
            "category": ["exact"],
            "transaction_type": ["exact"],
        }
