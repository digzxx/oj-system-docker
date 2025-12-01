# backend/problem/urls.py
from django.urls import path
from .views import ProblemListView

urlpatterns = [
    # Path: /api/problems/
    path('problems/', ProblemListView.as_view(), name='problem-list'),
]