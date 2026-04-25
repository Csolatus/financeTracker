from django.contrib.auth.models import User
from django.db import models


class Profile(models.Model):
    """
    Extension du modèle User natif de Django.
    On évite de réécrire un modèle User from scratch — on ajoute
    uniquement les champs spécifiques à notre app via une relation OneToOne.
    """

    CURRENCY_CHOICES = [
        ("EUR", "Euro (€)"),
        ("USD", "Dollar américain ($)"),
        ("GBP", "Livre sterling (£)"),
        ("CHF", "Franc suisse (CHF)"),
        ("CAD", "Dollar canadien (CA$)"),
        ("JPY", "Yen japonais (¥)"),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    preferred_currency = models.CharField(
        max_length=3,
        choices=CURRENCY_CHOICES,
        default="EUR",
    )

    def __str__(self):
        return f"Profil de {self.user.username}"
