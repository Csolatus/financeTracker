from django.urls import path

from .views import TransactionListCreateView, TransactionDetailView, TransactionExportView

urlpatterns = [
    path("",          TransactionListCreateView.as_view(), name="transaction-list"),
    path("export/",   TransactionExportView.as_view(),     name="transaction-export"),
    path("<int:pk>/", TransactionDetailView.as_view(),     name="transaction-detail"),
]
