from django.contrib import admin

from .models import Transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ["title", "transaction_type", "amount", "currency", "category", "date", "is_recurring", "user"]
    list_filter = ["transaction_type", "currency", "is_recurring", "category"]
    search_fields = ["title", "notes"]
    date_hierarchy = "date"
    ordering = ["-date"]
