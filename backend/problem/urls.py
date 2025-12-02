# backend/problem/urls.py
from django.urls import path
from .views import ProblemListView,ProblemDetailView

urlpatterns = [
    # Path: /api/problems/
    path('problems/', ProblemListView.as_view(), name='problem-list'),

    # 2. 详情路由: /api/problems/123/
    path('problems/<int:pk>/', ProblemDetailView.as_view(), name='problem-detail'),
]