from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),

    # Auth (JWT)
    path("api/auth/", include("apps.users.urls")),

    # Ressources
    path("api/categories/", include("apps.categories.urls")),
    path("api/transactions/", include("apps.transactions.urls")),
    path("api/dashboard/", include("apps.dashboard.urls")),
]
