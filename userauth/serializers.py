from uuid import uuid4
from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from userauth.models import Transactions,Balance
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super(MyTokenObtainPairSerializer, cls).get_token(user)

        # Add custom claims
        token["username"] = user.username
        return token


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True, validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)
    class Meta:
        model = User
        fields = (
            "username",
            "password",
            "password2",
            "email",
            "first_name",
            "last_name",
        )
        extra_kwargs = {
            "first_name": {"required": True},
            "last_name": {"required": True},
        }

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )
        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data["username"],
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
        )
        user.set_password(validated_data["password"])
        user.save()
        return user



class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transactions
        fields = (
            "id",
            "owner",
            "transaction_with",
            "amount",
            "transaction_id",
            "transaction_type",
            "transaction_date",
            "transaction_status",
            "reason",
        )

    def to_representation(self, value):
        """
        Serialize tagged objects to a simple textual representation.
        """
        data = super().to_representation(value)
        data["transaction_with"] = value.transaction_with.username
        data["owner"] = value.owner.username
        data['transaction_date'] = value.transaction_date.date()
        return data
  
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id","username",)

