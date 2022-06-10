from .models import Transactions,Balance
from django.contrib.auth.models import User
from django.db.models import Sum

class TransactionsManagement(object):

    def create_lend_transaction_user(self,data, instance):
    
        lend_transaction = Transactions.objects.create(
                    owner=User.objects.get(id=data['transaction_with']),
                    transaction_with=User.objects.get(id=data['owner']),
                    transaction_id = instance.transaction_id,
                    transaction_type="lend",
                    amount=data["amount"],
                    reason=data["reason"],
                )
        lend_transaction.save()

    def create_borrow_transaction_user(self,data,instance):
       
        borrow_transaction = Transactions.objects.create(
                    owner=User.objects.get(id=data['transaction_with']),
                    transaction_with=User.objects.get(id=data['owner']),
                    transaction_id = instance.transaction_id,
                    transaction_type="borrow",
                    amount=data["amount"],
                    reason=data["reason"],
                )
        borrow_transaction.save()
    
    def create_borrow_transaction_user_status_paid(self,data,instance):
        borrow_transaction = Transactions.objects.create(
                    owner=User.objects.get(id=data['transaction_with']),
                    transaction_with=User.objects.get(id=data['owner']),
                    transaction_id = instance.transaction_id,
                    transaction_type="borrow",
                    transaction_status=True,
                    amount=data["amount"],
                    reason=data["reason"],
                )
        borrow_transaction.save()
    
    def get_owner_transactions(self,id):
        
        return Transactions.objects.filter(owner=id).order_by('-id')

    def get_transactions_lend(self,transaction_id):
        return Transactions.objects.filter(transaction_id=transaction_id,transaction_type="lend").first()

    def get_transactions_borrow(self,transaction_id):
        return Transactions.objects.filter(transaction_id=transaction_id,transaction_type="borrow").first()


    def get_transactions_by_id(self,id):
       
        return Transactions.objects.filter(id=id,).first()

    def get_all_borrow_transactions_by_id(self,id):

        borrow = Transactions.objects.filter(owner=id,transaction_type='borrow').aggregate(borrow_sum=Sum('amount'))
        return borrow['borrow_sum'] if borrow['borrow_sum']!= None else 0

    def get_all_lend_transactions_by_id(self,id):
        lend = Transactions.objects.filter(owner=id,transaction_type='lend').aggregate(lend_sum=Sum('amount'))
        return lend['lend_sum'] if lend['lend_sum']!= None else 0

class UserManagement(object):
    
    def get_list_users(self,id):
    
        return User.objects.all().exclude(id=id)
    
class BalanceManagement(object):
    def get_balance_data(self,id):
        return Balance.objects.filter(owner=id).first()
