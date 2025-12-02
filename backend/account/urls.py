# backend/account/urls.py
from django.urls import path
from .views import RegisterView

urlpatterns = [
    # Path: /api/register/
    path('register/', RegisterView.as_view(), name='auth_register'),
]