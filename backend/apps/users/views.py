from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Profile
from .serializers import RegisterSerializer, UserSerializer, ProfileSerializer


class RegisterView(generics.CreateAPIView):
    """
    POST /api/auth/register/
    Crée un nouvel utilisateur. Accessible sans authentification.
    """

    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class MeView(generics.RetrieveUpdateAPIView):
    """
    GET  /api/auth/me/  → retourne l'utilisateur connecté avec son profil.
    PUT  /api/auth/me/  → met à jour la devise préférée.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return ProfileSerializer
        return UserSerializer

    def get_object(self):
        if self.request.method in ("PUT", "PATCH"):
            return self.request.user.profile
        return self.request.user
