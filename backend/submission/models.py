# backend/submission/models.py
from django.db import models
# Import models from the 'problem' app and Django's built-in User model
from problem.models import Problem 
from django.contrib.auth.models import User 

class Submission(models.Model):
    """
    Records user submissions, their status, and execution results.
    """
    
    # Submission Statuses (Important for the frontend display)
    STATUS_CHOICES = [
        ('PENDING', 'Pending (等待判题)'),
        ('JUDGING', 'Judging (正在判题)'),
        ('AC', 'Accepted (通过)'),
        ('WA', 'Wrong Answer (错误答案)'),
        ('TLE', 'Time Limit Exceeded (超时)'),
        ('MLE', 'Memory Limit Exceeded (超内存)'),
        ('RE', 'Runtime Error (运行时错误)'),
        ('CE', 'Compile Error (编译错误)'),
    ]

    # Links
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="提交用户")
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE, verbose_name="提交题目")

    # Code Details
    language = models.CharField(max_length=50, verbose_name="编程语言")
    code = models.TextField(verbose_name="提交代码")
    submitted_at = models.DateTimeField(auto_now_add=True)

    # Result Metrics
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='PENDING',
        verbose_name="判题状态"
    )
    time_cost_ms = models.IntegerField(null=True, blank=True, verbose_name="耗时 (ms)")
    memory_cost_kb = models.IntegerField(null=True, blank=True, verbose_name="内存 (KB)")
    
    # Detailed Feedback (e.g., compile error message, first failing test case)
    feedback = models.TextField(null=True, blank=True, verbose_name="详细反馈")

    class Meta:
        ordering = ['-submitted_at']
        verbose_name = "提交记录"
        verbose_name_plural = "提交记录"

    def __str__(self):
        return f"Submission {self.id} - {self.status}"