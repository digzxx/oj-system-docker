# backend/submission/views.py
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated # ⬅️ 权限关键！
from .models import Submission
from .serializers import SubmissionSerializer

class SubmissionCreateAPIView(generics.CreateAPIView):
    """
    API view for submitting code to a specific problem.
    """
    serializer_class = SubmissionSerializer
    
    # 🎯 触发点 1: 权限拦截 (Hook)
    # 只有携带有效 JWT Token 的已认证用户才能访问此视图 (POST操作)
    permission_classes = [IsAuthenticated] 
    
    # 提交是创建操作，不需要定义 queryset