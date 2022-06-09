from django.contrib import admin
from .models import Transactions,Balance


# Register your models here.


class TransactionsAdmin(admin.ModelAdmin):
    list_display = (
        "amount",
        "transaction_id",
        "transaction_type",
        "transaction_date",
        "transaction_status",
        "transaction_with",
        "reason",
    )
    list_per_page = 50


admin.site.register(Transactions, TransactionsAdmin)
admin.site.register(Balance)