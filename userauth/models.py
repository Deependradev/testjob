from django.db import models
from django.contrib.auth.models import User

# Create your models here.
from uuid import uuid4


def generateUUID():
    return str(uuid4())


class Transactions(models.Model):
    BORROW = "borrow"
    LEND = "lend"
    TRANSACTION_TYPE = (
        (BORROW, "Borrow"),
        (LEND, "Lend"),
    )
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owner")
    transaction_with = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="transaction_with"
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    transaction_id = models.UUIDField(default=generateUUID, editable=False)
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPE)
    transaction_date = models.DateTimeField(auto_now_add=True)
    transaction_status = models.BooleanField(default=False, verbose_name="Paid")
    reason = models.CharField(max_length=255)

    def __str__(self):
        return str(self.transaction_id)


class Balance(models.Model):
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    owner = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.owner} {self.balance}'