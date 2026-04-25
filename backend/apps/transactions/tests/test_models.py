import pytest
from conftest import TransactionFactory
from apps.transactions.models import Transaction


@pytest.mark.django_db
class TestTransactionModel:

    def test_transaction_str(self):
        t = TransactionFactory(title="Loyer", amount=800, currency="EUR")
        assert "Loyer" in str(t)
        assert "800" in str(t)
        assert "EUR" in str(t)

    def test_default_ordering_is_most_recent_first(self):
        TransactionFactory(date="2026-01-01")
        TransactionFactory(date="2026-03-01")
        dates = list(Transaction.objects.values_list("date", flat=True))
        assert dates == sorted(dates, reverse=True)

    def test_transaction_belongs_to_user(self):
        t = TransactionFactory()
        assert t.user is not None

    def test_amount_is_positive(self):
        t = TransactionFactory(amount=150.50)
        assert t.amount > 0
