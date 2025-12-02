# backend/problem/views.py
from rest_framework import generics
from .models import Problem
from .serializers import ProblemSerializer

class ProblemListView(generics.ListAPIView):
    """
    API view to list all public problems.
    """
    serializer_class = ProblemSerializer
    
    # Only retrieve problems that are marked as public
    queryset = Problem.objects.filter(is_public=True).order_by('id')

class ProblemDetailView(generics.RetrieveAPIView):
    """
    API view to retrieve the details of a single public problem.
    """
    # 告诉 DRF 使用哪个序列化器来格式化单个对象
    serializer_class = ProblemSerializer
    
    # 告诉 DRF 从哪个查询集（queryset）中查找对象
    queryset = Problem.objects.filter(is_public=True)
    
    # 告诉 DRF 应该使用 URL 中的哪个参数来查找对象（默认为 'pk'）
    lookup_field = 'pk'