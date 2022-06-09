from django.urls import path
from userauth.views import (
    RegisterView,
    TransactionPostView,
    TransactionGetView,
    TransactionDetailView,
    Userview,
    LogoutView,
    AddBalance,
    TotalTransactionAmount,
)
from userauth.views import MyObtainTokenPairView
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt import views as jwt_views


urlpatterns = [
    path("login/", MyObtainTokenPairView.as_view(), name="login"),
    path("login/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("register/", RegisterView.as_view(), name="auth_register"),
    path("logout/", LogoutView.as_view(), name="logout"),    
    path("add_transaction/", TransactionPostView.as_view(), name="add_transaction"),
    path("get_transactions/", TransactionGetView.as_view(), name="get_transactions"),
    path("mark_paid/<int:id>/", TransactionDetailView.as_view(), name="mark_paid"),
    path("all_users/", Userview.as_view(), name="users"),
    path("add_balance/", AddBalance.as_view(), name="add_balance"),
    path("all_type_balance/", TotalTransactionAmount.as_view(), name="transactionn_sum"),
]
