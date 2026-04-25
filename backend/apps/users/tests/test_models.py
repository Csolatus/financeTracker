import pytest
from conftest import UserFactory, ProfileFactory


@pytest.mark.django_db
class TestProfileModel:

    def test_profile_str(self):
        profile = ProfileFactory()
        assert str(profile) == f"Profil de {profile.user.username}"

    def test_profile_default_currency(self):
        profile = ProfileFactory()
        assert profile.preferred_currency == "EUR"

    def test_profile_linked_to_user(self):
        profile = ProfileFactory()
        assert profile.user is not None
        assert profile.user.profile == profile
