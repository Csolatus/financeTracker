from django.db import models


class Category(models.Model):
    """
    Catégories de transactions prédéfinies (Alimentation, Transport…).
    Créées une seule fois via une fixture — les utilisateurs ne peuvent
    pas en ajouter ou en supprimer.
    """

    ICON_CHOICES = [
        ("shopping-cart", "Alimentation"),
        ("car", "Transport"),
        ("home", "Logement"),
        ("heart", "Santé"),
        ("gamepad", "Loisirs"),
        ("wifi", "Abonnements"),
        ("shirt", "Vêtements"),
        ("book", "Éducation"),
        ("plane", "Voyages"),
        ("briefcase", "Salaire"),
        ("circle-dollar-sign", "Autres"),
    ]

    name = models.CharField(max_length=100, unique=True)
    icon = models.CharField(max_length=50, choices=ICON_CHOICES, default="circle-dollar-sign")
    is_default = models.BooleanField(
        default=True,
        help_text="Indique que cette catégorie est prédéfinie par l'application.",
    )

    class Meta:
        verbose_name = "Catégorie"
        verbose_name_plural = "Catégories"
        ordering = ["name"]

    def __str__(self):
        return self.name
