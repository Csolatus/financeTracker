from rest_framework import serializers

from apps.categories.serializers import CategorySerializer
from .models import Transaction


class TransactionSerializer(serializers.ModelSerializer):
    """
    Sérialise une transaction.

    Lecture  : la catégorie est retournée sous forme d'objet imbriqué (id + name + icon).
    Écriture : on envoie uniquement l'id de la catégorie via `category_id`.
    """

    # Lecture : objet catégorie complet
    category = CategorySerializer(read_only=True)

    # Écriture : on accepte un simple id
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=__import__("apps.categories.models", fromlist=["Category"]).Category.objects.all(),
        source="category",
        write_only=True,
    )

    class Meta:
        model = Transaction
        fields = [
            "id",
            "title",
            "amount",
            "currency",
            "transaction_type",
            "date",
            "notes",
            "is_recurring",
            "recurrence_frequency",
            "category",      # lecture
            "category_id",   # écriture
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate(self, data):
        is_recurring = data.get("is_recurring", False)
        recurrence_frequency = data.get("recurrence_frequency")

        if is_recurring and not recurrence_frequency:
            raise serializers.ValidationError({
                "recurrence_frequency": "Ce champ est obligatoire quand la transaction est récurrente."
            })

        if not is_recurring and recurrence_frequency:
            data["recurrence_frequency"] = None

        return data

    def create(self, validated_data):
        # On rattache automatiquement la transaction à l'utilisateur connecté
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)
