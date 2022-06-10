from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from userauth.models import Transactions,Balance
from django.db.models import Count, F, Value

from django.urls import reverse


APICLIENT = APIClient()


class TestAccount(APITestCase):
    def setUp(self):
        user=User.objects.create_user(username="testuser", password="password")
        Balance.objects.filter(owner=user).update(balance=F('balance')+100)


    def test_user_login(self):
        data = {"username": "testuser", "password": "password"}
        login_url = reverse("login")
        log_in = APICLIENT.post(login_url, data, format="json")
        self.assertEqual(log_in.status_code, 200)
        self.assertIsInstance(log_in.json().get("access"), str)

   
    def test_add_new_transaction(self):

        user=User.objects.create_user(username="testuser2", password="password")
        Balance.objects.filter(owner=user).update(balance=F('balance')+100)

        data = {"username": "testuser", "password": "password"}
        login_url = reverse("login")
        log_in = APICLIENT.post(login_url, data, format="json")
        transaction_data = {
            "transaction_with": User.objects.get(username="testuser2").id,
            "transaction_type": "lend",
            "reason": "test",
            "transaction_status":"false",
            "amount": 100,
        }
        transaction_data1 = {
            "transaction_with": 100,
            "transaction_type": "lend",
            "transaction_status":"false",
            "reason": "test",
            "amount": 100,
        }

        headers = {"HTTP_AUTHORIZATION": f'Bearer {log_in.json().get("access")}'}
        post_url = reverse("add_transaction")
        post_transation = self.client.post(post_url, transaction_data, **headers)
        post_transation1 = self.client.post(post_url, transaction_data1, **headers)

        self.assertEqual(post_transation.status_code, 201)
        self.assertEqual(post_transation.data['result']['owner'],data['username'])
        self.assertEqual(post_transation.data['status'],'Transaction created successfully')
        self.assertEqual(post_transation1.status_code, 400)
        self.assertEqual(post_transation1.data['status'],'Transaction failed')
        

        
    def test_get_transactions(self):
        login_url = reverse("login")
        data = {"username": "testuser", "password": "password"}
        log_in = self.client.post(login_url, data, format="json")
        headers = {"HTTP_AUTHORIZATION": f'Bearer {log_in.json().get("access")}'}

        get_url = reverse("get_transactions")
        get_transations = self.client.get(get_url, **headers)
        self.assertEqual(get_transations.status_code, 404)
        self.assertEqual(get_transations.data['data'], "Transactions does not exist or belongs to you")

        user=User.objects.create_user(username="testuser2", password="password")
        Balance.objects.filter(owner=user).update(balance=F('balance')+100)

        log_in = APICLIENT.post(login_url, data, format="json")
        transaction_data = {
            "transaction_with": User.objects.get(username="testuser2").id,
            "transaction_type": "lend",
            "transaction_status":"false",
            "reason": "test",
            "amount": 100,
        }
        post_url = reverse("add_transaction")
        post_transation = self.client.post(post_url, transaction_data, **headers)
        
        get_url = reverse("get_transactions")
        get_transations = self.client.get(get_url, **headers)
        self.assertEqual(get_transations.status_code, 200)
        self.assertEqual(get_transations.data['count'], 1)


    def test_markpaid_transaction(self):
        user=User.objects.create_user(username="testuser2", password="password")
        Balance.objects.filter(owner=user).update(balance=F('balance')+100)

        login_url = reverse("login")
        data = {"username": "testuser", "password": "password"}
        log_in = self.client.post(login_url, data, format="json")
        headers = {"HTTP_AUTHORIZATION": f'Bearer {log_in.json().get("access")}'}
        transaction_data = {
            "transaction_with": User.objects.get(username="testuser2").id,
            "transaction_type": "lend",
            "transaction_status":"false",
            "reason": "test",
            "amount": 100,
        }
        post_url = reverse("add_transaction")
        post_transation = self.client.post(post_url, transaction_data, **headers)

        transaction_id = post_transation.json().get("result").get("transaction_id")

        get_url = reverse("mark_paid", args=[transaction_id])
        paid_transation = self.client.patch(get_url, **headers)
        self.assertEqual(paid_transation.status_code, 200)
        self.assertEqual(paid_transation.data['data'], 'Transaction status paid successfully')

        transaction_id = post_transation.json().get("result").get("transaction_id")

        get_url = reverse("mark_paid", args=[transaction_id])
        paid_transation = self.client.patch(get_url, **headers)
        self.assertEqual(paid_transation.status_code, 404)
        self.assertEqual(paid_transation.data['data'], 'Insufficient balance or transaction type borrow or transaction already paid')
        
       
    def test_all_users(self):
        User.objects.create_user(username="testuser2", password="password")
        User.objects.create_user(username="testuser3", password="password")
        
        login_url = reverse("login")
        data = {"username": "testuser", "password": "password"}
        log_in = self.client.post(login_url, data, format="json")
        headers = {"HTTP_AUTHORIZATION": f'Bearer {log_in.json().get("access")}'}
        all_users_url = reverse("users")
        all_users = self.client.get(all_users_url, **headers)
        self.assertEqual(all_users.status_code, 200)
        User.objects.filter(username='testuser2').delete()
        User.objects.filter(username='testuser3').delete()
        all_users_url = reverse("users")
        all_users = self.client.get(all_users_url, **headers)

        self.assertEqual(all_users.status_code, 404)
        self.assertEqual(all_users.data['data'], 'User not found')
        
      