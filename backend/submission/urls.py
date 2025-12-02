# backend/submission/urls.py
from django.urls import path
from .views import SubmissionCreateAPIView

urlpatterns = [
    # 路径: /api/submissions/
    path('submissions/', SubmissionCreateAPIView.as_view(), name='submission-create'),
]