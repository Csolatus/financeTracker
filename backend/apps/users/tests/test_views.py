import pytest
from django.urls import reverse
from django.contrib.auth.models import User


@pytest.mark.django_db
class TestRegisterView:

    def test_register_success(self, api_client):
        url = reverse("auth-register")
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "StrongPass123!",
            "password_confirm": "StrongPass123!",
        }
        response = api_client.post(url, data)
        assert response.status_code == 201
        assert User.objects.filter(username="newuser").exists()

    def test_register_passwords_mismatch(self, api_client):
        url = reverse("auth-register")
        data = {
            "username": "newuser",
            "password": "StrongPass123!",
            "password_confirm": "WrongPass123!",
        }
        response = api_client.post(url, data)
        assert response.status_code == 400
        assert "password_confirm" in response.data

    def test_register_duplicate_username(self, api_client, user):
        url = reverse("auth-register")
        data = {
            "username": user.username,
            "password": "StrongPass123!",
            "password_confirm": "StrongPass123!",
        }
        response = api_client.post(url, data)
        assert response.status_code == 400


@pytest.mark.django_db
class TestLoginView:

    def test_login_success(self, api_client, user):
        url = reverse("auth-login")
        response = api_client.post(url, {"username": user.username, "password": "testpassword123"})
        assert response.status_code == 200
        assert "access" in response.data
        assert "refresh" in response.data

    def test_login_wrong_password(self, api_client, user):
        url = reverse("auth-login")
        response = api_client.post(url, {"username": user.username, "password": "wrongpassword"})
        assert response.status_code == 401


@pytest.mark.django_db
class TestMeView:

    def test_me_returns_user(self, auth_client, user):
        url = reverse("auth-me")
        response = auth_client.get(url)
        assert response.status_code == 200
        assert response.data["username"] == user.username

    def test_me_requires_auth(self, api_client):
        url = reverse("auth-me")
        response = api_client.get(url)
        assert response.status_code == 401

    def test_me_update_currency(self, auth_client):
        url = reverse("auth-me")
        response = auth_client.put(url, {"preferred_currency": "USD"})
        assert response.status_code == 200
        assert response.data["preferred_currency"] == "USD"
