import pytest
from django.urls import reverse
from conftest import TransactionFactory
from apps.transactions.models import Transaction


@pytest.mark.django_db
class TestTransactionListCreateView:

    def test_list_requires_auth(self, api_client):
        response = api_client.get(reverse("transaction-list"))
        assert response.status_code == 401

    def test_user_sees_only_own_transactions(self, auth_client, user, other_user, category):
        TransactionFactory(user=user, category=category)
        TransactionFactory(user=other_user, category=category)
        response = auth_client.get(reverse("transaction-list"))
        assert response.status_code == 200
        assert response.data["count"] == 1

    def test_create_transaction(self, auth_client, category):
        data = {
            "title": "Courses",
            "amount": "45.00",
            "currency": "EUR",
            "transaction_type": "EXPENSE",
            "date": "2026-03-15",
            "category_id": category.id,
            "is_recurring": False,
        }
        response = auth_client.post(reverse("transaction-list"), data)
        assert response.status_code == 201
        assert Transaction.objects.filter(title="Courses").exists()

    def test_create_recurring_without_frequency_fails(self, auth_client, category):
        data = {
            "title": "Loyer",
            "amount": "800.00",
            "currency": "EUR",
            "transaction_type": "EXPENSE",
            "date": "2026-03-01",
            "category_id": category.id,
            "is_recurring": True,
            # recurrence_frequency manquant volontairement
        }
        response = auth_client.post(reverse("transaction-list"), data)
        assert response.status_code == 400
        assert "recurrence_frequency" in response.data

    def test_filter_by_month(self, auth_client, user, category):
        TransactionFactory(user=user, category=category, date="2026-03-10")
        TransactionFactory(user=user, category=category, date="2026-01-05")
        response = auth_client.get(reverse("transaction-list"), {"month": "2026-03"})
        assert response.status_code == 200
        assert response.data["count"] == 1


@pytest.mark.django_db
class TestTransactionDetailView:

    def test_retrieve_own_transaction(self, auth_client, user, category):
        t = TransactionFactory(user=user, category=category)
        response = auth_client.get(reverse("transaction-detail", args=[t.id]))
        assert response.status_code == 200
        assert response.data["title"] == t.title

    def test_cannot_access_other_user_transaction(self, auth_client, other_user, category):
        t = TransactionFactory(user=other_user, category=category)
        response = auth_client.get(reverse("transaction-detail", args=[t.id]))
        assert response.status_code == 404

    def test_delete_own_transaction(self, auth_client, user, category):
        t = TransactionFactory(user=user, category=category)
        response = auth_client.delete(reverse("transaction-detail", args=[t.id]))
        assert response.status_code == 204
        assert not Transaction.objects.filter(id=t.id).exists()


@pytest.mark.django_db
class TestTransactionExportView:

    def test_export_returns_csv(self, auth_client, user, category):
        TransactionFactory(user=user, category=category)
        response = auth_client.get(reverse("transaction-export"))
        assert response.status_code == 200
        assert response["Content-Type"] == "text/csv"

    def test_export_only_own_transactions(self, auth_client, user, other_user, category):
        TransactionFactory(user=user, category=category, title="Ma transaction")
        TransactionFactory(user=other_user, category=category, title="Pas la mienne")
        response = auth_client.get(reverse("transaction-export"))
        content = response.content.decode("utf-8")
        assert "Ma transaction" in content
        assert "Pas la mienne" not in content
