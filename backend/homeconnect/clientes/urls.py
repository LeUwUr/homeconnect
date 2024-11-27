from django.urls import path
from .views import register_client, login_client, check_email

urlpatterns = [
    path("register/", register_client, name="register_client"),
    path("login/", login_client, name="login_client"),
    path("check-email/", check_email, name="check_email"),
]