"""
Factories et fixtures pytest partagées entre toutes les apps.
factory_boy génère des objets en base de test en une ligne.
"""

import pytest
import factory
from django.contrib.auth.models import User
from rest_framework.test import APIClient

from apps.categories.models import Category
from apps.transactions.models import Transaction
from apps.users.models import Profile


# ── Factories ──────────────────────────────────────────────────────────────────

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
        skip_postgeneration_save = True  # on gère le save manuellement dans le hook

    username = factory.Sequence(lambda n: f"user_{n}")
    email    = factory.LazyAttribute(lambda obj: f"{obj.username}@example.com")

    @factory.post_generation
    def password(self, create, extracted, **kwargs):
        self.set_password(extracted or "testpassword123")
        if create:
            self.save()


class ProfileFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Profile

    user               = factory.SubFactory(UserFactory)
    preferred_currency = "EUR"


class CategoryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Category

    name = factory.Sequence(lambda n: f"Catégorie {n}")
    icon = "circle-dollar-sign"


class TransactionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Transaction

    user             = factory.SubFactory(UserFactory)
    category         = factory.SubFactory(CategoryFactory)
    title            = factory.Sequence(lambda n: f"Transaction {n}")
    amount           = factory.Faker("pydecimal", left_digits=4, right_digits=2, positive=True)
    currency         = "EUR"
    transaction_type = Transaction.TransactionType.EXPENSE
    date             = factory.Faker("date_this_year")
    is_recurring     = False


# ── Fixtures pytest ────────────────────────────────────────────────────────────

@pytest.fixture
def user():
    u = UserFactory()
    Profile.objects.get_or_create(user=u)
    return u

@pytest.fixture
def other_user():
    u = UserFactory()
    Profile.objects.get_or_create(user=u)
    return u

@pytest.fixture
def category():
    return CategoryFactory()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def auth_client(user):
    """Client authentifié avec un JWT valide."""
    from rest_framework_simplejwt.tokens import RefreshToken
    client = APIClient()
    token = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token.access_token}")
    return client
