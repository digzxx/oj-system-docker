# backend/submission/serializers.py
from rest_framework import serializers
from .models import Submission

class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        # 仅允许用户在创建时提交这三个字段
        fields = ('id', 'problem', 'code', 'language')
        
    # 重写 create 方法，自动添加当前登录用户
    def create(self, validated_data):
        # 从 context 中获取当前请求的用户对象
        user = self.context['request'].user
        
        # 将用户对象添加到验证后的数据中
        submission = Submission.objects.create(user=user, **validated_data)
        return submission