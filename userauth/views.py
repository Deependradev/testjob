from distutils.log import log
from django.shortcuts import render
from userauth.models import Transactions
from django.db import transaction
from .serializers import RegisterSerializer, TransactionSerializer, UserSerializer
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from .models import Transactions
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from django.forms.models import model_to_dict
from .serializers import MyTokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .services import TransactionsManagement, UserManagement, BalanceManagement
from rest_framework.status import (
    HTTP_205_RESET_CONTENT,
    HTTP_400_BAD_REQUEST,
    HTTP_201_CREATED,
    HTTP_200_OK,
    HTTP_404_NOT_FOUND,
)
from .constants import (
    TRANSACTION_SUCCESS,
    TRANSACTION_ERROR,
    TRANSACTION_NOT_FOUND_ERROR,
    TRANSACTION_STATUS,
    TRANSACTION_STATUS_ERROR,
    USER_NOT_FOUND_ERROR,
    BALANCE_ERROR,
    USER_BALANCE_ERROR,
    BALANCE_NOT_FOUND_ERROR,
)
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Balance

class MyObtainTokenPairView(TokenObtainPairView):
    ''' login user'''
    permission_classes = (AllowAny,)
    serializer_class = MyTokenObtainPairSerializer



class LogoutView(generics.CreateAPIView):
    '''logout user'''
    permission_classes = (IsAuthenticated,)
    def post(self, request):
        try:
            refresh_token = RefreshToken.for_user(request.user)
            refresh_token.blacklist()
            return Response(status=HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=HTTP_400_BAD_REQUEST)



class RegisterView(generics.CreateAPIView):
    '''Register user'''
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer



class TransactionPostView(generics.CreateAPIView):
    '''Add transactions'''
    permission_classes = (IsAuthenticated,)
    serializer_class = TransactionSerializer

    def post(self, request):
        request_data = request.data.copy()
        request_data["owner"] = request.user.id
        serializer = self.serializer_class(data=request_data)
        if serializer.is_valid():
            transaction_mangement = TransactionsManagement()
            if request.data["transaction_type"] == "borrow":
                instance = serializer.save()
                transaction_mangement.create_lend_transaction_user(request_data, instance)
            elif (
                request.data["transaction_type"] == "lend"
                and request.data["transaction_status"] == "true"
            ):
                try:
                    if int(request.user.balance.balance) >= int(request.data["amount"]):
                        other = (
                            transaction_mangement.create_borrow_transaction_user_return(
                                request_data
                            )
                        )
                        owner = serializer.save()
                        balance_transactions = BalanceManagement().get_balance_data(
                            owner.owner
                        )
                        balance_other_transactions = BalanceManagement().get_balance_data(
                            other.owner
                        )
                        with transaction.atomic():
                            balance_transactions.balance = (
                                balance_transactions.balance - int(other.amount)
                            )
                            balance_transactions.save()
                            balance_other_transactions.balance = (
                                balance_other_transactions.balance + int(other.amount)
                            )
                            balance_other_transactions.save()
                    else:
                        return Response(
                            {"status": BALANCE_ERROR}, status=HTTP_400_BAD_REQUEST
                        )
                except :
                    return Response(
                            {"status": BALANCE_NOT_FOUND_ERROR}, status=HTTP_400_BAD_REQUEST
                        )

            elif request.data["transaction_type"] == "lend":
                if int(request.user.balance.balance) >= int(request.data["amount"]):
                    TransactionsManagement().create_borrow_transaction_user(
                        request_data
                    )
                    serializer.save()
                else:
                    return Response(
                        {"status": BALANCE_ERROR}, status=HTTP_400_BAD_REQUEST
                    )
            return Response(
                {"status": TRANSACTION_SUCCESS, "result": serializer.data},
                status=HTTP_201_CREATED,
            )
        return Response(
            {"status": TRANSACTION_ERROR, "result": serializer.errors},
            status=HTTP_400_BAD_REQUEST,
        )


class TransactionGetView(generics.CreateAPIView):
    """all Transactions list of login user"""

    permission_classes = (IsAuthenticated,)
    serializer_class = TransactionSerializer
    def get(self, request):
        transactions = TransactionsManagement().get_owner_transactions(
            id=request.user.id
        )
        serializer = self.serializer_class(transactions, many=True)
        if transactions:

            return Response(
                {"count": transactions.count(), "data": serializer.data}, HTTP_200_OK
            )
        return Response({"data": TRANSACTION_NOT_FOUND_ERROR}, HTTP_404_NOT_FOUND)



class TransactionDetailView(generics.CreateAPIView):
    '''transaction_status update'''
    permission_classes = (IsAuthenticated,)
    def patch(self, request, id):
        transactions = TransactionsManagement().get_transactions_by_id(id)
        other_transactions = TransactionsManagement().get_transactions_by_id(id - 1)
        if transactions and other_transactions:
            balance_transactions = BalanceManagement().get_balance_data(
                transactions.owner
            )
            balance_other_transactions = BalanceManagement().get_balance_data(
                other_transactions.owner
            )
            if (
                transactions.transaction_status != True
                and other_transactions.transaction_status != True
                and transactions.transaction_type == "lend"
            ):
                if balance_transactions.balance >= other_transactions.amount:
                    with transaction.atomic():
                        balance_transactions.balance = (
                            balance_transactions.balance
                            - int(other_transactions.amount)
                        )
                        balance_transactions.save()
                        balance_other_transactions.balance = (
                            balance_other_transactions.balance
                            + int(other_transactions.amount)
                        )
                        balance_other_transactions.save()
                        transactions.transaction_status = True
                        transactions.save()
                        other_transactions.transaction_status = True
                        other_transactions.save()
                else:
                    return Response(
                        {"status": BALANCE_ERROR}, status=HTTP_400_BAD_REQUEST
                    )
                return Response(
                    {"data": TRANSACTION_STATUS}, status=HTTP_205_RESET_CONTENT
                )
            return Response({"data": TRANSACTION_STATUS_ERROR}, status=HTTP_200_OK)
        return Response(
            {"data": TRANSACTION_NOT_FOUND_ERROR}, status=HTTP_404_NOT_FOUND
        )



class Userview(generics.CreateAPIView):
    '''list of all users'''
    permission_classes = (AllowAny, IsAuthenticated)
    serializer_class = UserSerializer
    def get(self, request):
        users = UserManagement().get_list_users(id=request.user.id)
        if users:
            serializer = self.serializer_class(users, many=True)
            return Response({"data": serializer.data}, status=HTTP_200_OK)
        return Response({"data": USER_NOT_FOUND_ERROR}, status=HTTP_404_NOT_FOUND)



class AddBalance(generics.CreateAPIView):
    '''add balance'''
    permission_classes = (IsAuthenticated,)
    def post(self, request):
        wallet = Balance.objects.filter(owner=request.user.id).first()
        if wallet:
            wallet.balance = wallet.balance + int(request.data.get("balance"))
            wallet.save()
            return Response(
                {
                    "data": f"successfully add {request.data.get('balance')} total balance {wallet.balance}"
                },
                status=HTTP_200_OK,
            )
        return Response({"data": USER_BALANCE_ERROR}, status=HTTP_400_BAD_REQUEST)



class TotalTransactionAmount(generics.CreateAPIView):
    '''total balance, total borrow , total lend'''
    permission_classes = (IsAuthenticated,)
    def get(self, request):
        balance = BalanceManagement().get_balance_data(request.user.id)
        borrow_balance = TransactionsManagement().get_all_borrow_transactions_by_id(
            request.user.id
        )
        lend_balance = TransactionsManagement().get_all_lend_transactions_by_id(
            request.user.id
        )
        return Response(
            {
                "balance": balance.balance,
                "borrow_balance": borrow_balance,
                "lend_balance": lend_balance,
            },
            status=200,
        )
