# backend/problem/serializers.py
from rest_framework import serializers
from .models import Problem

class ProblemSerializer(serializers.ModelSerializer):
    """
    Serializer for listing Problem objects, showing basic information.
    """
    difficulty_display = serializers.CharField(source='get_difficulty_display', read_only=True)

    class Meta:
        model = Problem
        # Define the fields the API should expose
        fields = (
            'id', 
            'title', 
            'difficulty', 
            'difficulty_display', # Displays '简单', '中等', etc.
            'time_limit_ms', 
            'memory_limit_mb', 
            'is_public',
            'created_at',
        )