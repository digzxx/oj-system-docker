# backend/account/models.py
from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    """
    Stores additional, custom information for a user in the OJ system.
    Linked 1-to-1 with Django's built-in User model.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    
    # Custom fields for the OJ system
    solved_count = models.IntegerField(default=0, verbose_name="已解决题目数")
    nickname = models.CharField(max_length=50, blank=True, verbose_name="昵称")
    
    # User roles
    ROLE_CHOICES = [
        ('NORMAL', '普通用户'),
        ('ADMIN', '管理员'),
        ('SETTER', '出题人'),
    ]
    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default='NORMAL',
        verbose_name="用户角色"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "用户档案"
        verbose_name_plural = "用户档案"

    def __str__(self):
        return f"Profile for {self.user.username}"