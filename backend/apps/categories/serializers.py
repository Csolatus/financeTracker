from rest_framework import serializers

from .models import Category


class CategorySerializer(serializers.ModelSerializer):
    """Sérialise une catégorie pour la lecture uniquement (pas de création via l'API)."""

    class Meta:
        model = Category
        fields = ["id", "name", "icon"]
