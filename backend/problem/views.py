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