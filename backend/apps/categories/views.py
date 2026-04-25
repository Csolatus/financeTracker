from rest_framework import generics, permissions

from .models import Category
from .serializers import CategorySerializer


class CategoryListView(generics.ListAPIView):
    """
    GET /api/categories/
    Retourne la liste de toutes les catégories prédéfinies.
    Lecture seule — les utilisateurs ne peuvent pas créer ou supprimer des catégories.
    """

    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None  # 11 catégories fixes — pas besoin de pagination
