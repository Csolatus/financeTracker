import pytest
from datetime import date
from django.urls import reverse
from conftest import TransactionFactory
from apps.transactions.models import Transaction


@pytest.mark.django_db
class TestDashboardSummaryView:

    def test_summary_requires_auth(self, api_client):
        response = api_client.get(reverse("dashboard-summary"))
        assert response.status_code == 401

    def test_summary_structure(self, auth_client):
        response = auth_client.get(reverse("dashboard-summary"))
        assert response.status_code == 200
        assert "period" in response.data
        assert "totals" in response.data
        assert "balance" in response.data
        assert "expenses_by_category" in response.data
        assert "monthly_evolution" in response.data

    def test_balance_calculation(self, auth_client, user, category):
        today = date.today()
        TransactionFactory(
            user=user, category=category,
            transaction_type=Transaction.TransactionType.INCOME,
            amount=3000, date=today,
        )
        TransactionFactory(
            user=user, category=category,
            transaction_type=Transaction.TransactionType.EXPENSE,
            amount=1200, date=today,
        )
        response = auth_client.get(reverse("dashboard-summary"))
        assert response.status_code == 200
        assert response.data["balance"] == 1800.0

    def test_summary_excludes_other_user_data(self, auth_client, user, other_user, category):
        today = date.today()
        TransactionFactory(
            user=other_user, category=category,
            transaction_type=Transaction.TransactionType.INCOME,
            amount=9999, date=today,
        )
        response = auth_client.get(reverse("dashboard-summary"))
        totals = response.data["totals"]
        assert totals.get("INCOME", 0) == 0
