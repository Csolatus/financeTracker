from django.contrib.auth.models import User
from django.db import models

from apps.categories.models import Category


class Transaction(models.Model):
    """
    Modèle central de l'application.
    Représente tout mouvement d'argent d'un utilisateur.
    """

    # ── Type de transaction ────────────────────────────────────────────────────
    class TransactionType(models.TextChoices):
        INCOME        = "INCOME",        "Revenu"
        EXPENSE       = "EXPENSE",       "Dépense"
        SAVINGS       = "SAVINGS",       "Épargne"
        REIMBURSEMENT = "REIMBURSEMENT", "Remboursement"
        TRANSFER      = "TRANSFER",      "Transfert"

    # ── Devise ────────────────────────────────────────────────────────────────
    class Currency(models.TextChoices):
        EUR = "EUR", "Euro (€)"
        USD = "USD", "Dollar américain ($)"
        GBP = "GBP", "Livre sterling (£)"
        CHF = "CHF", "Franc suisse (CHF)"
        CAD = "CAD", "Dollar canadien (CA$)"
        JPY = "JPY", "Yen japonais (¥)"

    # ── Fréquence de récurrence ───────────────────────────────────────────────
    class RecurrenceFrequency(models.TextChoices):
        DAILY   = "DAILY",   "Quotidien"
        WEEKLY  = "WEEKLY",  "Hebdomadaire"
        MONTHLY = "MONTHLY", "Mensuel"
        YEARLY  = "YEARLY",  "Annuel"

    # ── Champs ────────────────────────────────────────────────────────────────
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="transactions",
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,  # empêche la suppression d'une catégorie utilisée
        related_name="transactions",
    )
    title = models.CharField(max_length=255)
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Toujours positif. Le type de transaction indique le sens du mouvement.",
    )
    currency = models.CharField(
        max_length=3,
        choices=Currency.choices,
        default=Currency.EUR,
    )
    transaction_type = models.CharField(
        max_length=20,
        choices=TransactionType.choices,
    )
    date = models.DateField()
    notes = models.TextField(blank=True, default="")

    # ── Récurrence ────────────────────────────────────────────────────────────
    is_recurring = models.BooleanField(default=False)
    recurrence_frequency = models.CharField(
        max_length=10,
        choices=RecurrenceFrequency.choices,
        blank=True,
        null=True,
        help_text="Obligatoire uniquement si is_recurring est True.",
    )

    # ── Métadonnées ───────────────────────────────────────────────────────────
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Transaction"
        verbose_name_plural = "Transactions"
        ordering = ["-date", "-created_at"]  # les plus récentes en premier

    def __str__(self):
        return f"[{self.transaction_type}] {self.title} — {self.amount} {self.currency}"
