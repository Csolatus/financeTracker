from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User

from .models import Profile


class ProfileInline(admin.StackedInline):
    """Affiche le profil directement dans la page User de l'admin Django."""
    model = Profile
    can_delete = False


class UserAdmin(BaseUserAdmin):
    inlines = [ProfileInline]


# On remplace l'admin User par défaut par notre version enrichie
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
