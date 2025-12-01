from django.db import models

# --- 题目核心信息 ---
class Problem(models.Model):
    """
    Online Judge 系统中的一道编程题目。
    集成了判题类型和可选的 SPJ 判题程序。
    """
    
    # 判题类型选项
    JUDGE_TYPES = [
        ('NORMAL', '标准判题 (Strict Text Compare)'),
        ('SPJ', '自定义判题 (Special Judge)'),
    ]

    # 难度选项
    DIFFICULTY_CHOICES = [
        ('EASY', '简单'),
        ('MEDIUM', '中等'),
        ('HARD', '困难'),
    ]

    # 基本信息
    title = models.CharField(max_length=255, unique=True, verbose_name="题目名称")
    description = models.TextField(verbose_name="题目描述")
    
    # 限制条件
    time_limit_ms = models.IntegerField(default=1000, verbose_name="时间限制 (ms)")
    memory_limit_mb = models.IntegerField(default=256, verbose_name="内存限制 (MB)")
    
    # 判题与难度
    judge_type = models.CharField(
        max_length=10,
        choices=JUDGE_TYPES,
        default='NORMAL',
        verbose_name="判题类型"
    )
    difficulty = models.CharField(
        max_length=10,
        choices=DIFFICULTY_CHOICES,
        default='MEDIUM',
        verbose_name="难度"
    )

    # SPJ 判题程序文件（仅当 judge_type='SPJ' 时使用）
    spj_checker_code = models.FileField(
        upload_to='checkers/',
        null=True, 
        blank=True,
        verbose_name="SPJ 判题程序代码"
    )
    
    # 状态
    is_public = models.BooleanField(default=False, verbose_name="是否公开")
    
    # 时间戳
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "题目"
        verbose_name_plural = "题目"

    def __str__(self):
        return self.title


# --- 原始文件上传（ZIP 包） ---
class ProblemFiles(models.Model):
    """
    存储用户上传的测试用例原始文件包 (ZIP)
    """
    problem = models.OneToOneField( 
        Problem, 
        on_delete=models.CASCADE,
        related_name='file_bundle',
        verbose_name="所属题目"
    )
    test_case_zip = models.FileField(
        upload_to='test_cases/zips/', 
        verbose_name="测试用例ZIP包"
    )
    
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "题目原始文件包"
        verbose_name_plural = "题目原始文件包"
        
    def __str__(self):
        return f"Files for {self.problem.title}"


# --- 解析后的单个测试用例 ---
class TestCase(models.Model):
    """
    存储从 ZIP 包解析或手动输入的单个测试用例数据。
    """
    problem = models.ForeignKey(
        Problem, 
        on_delete=models.CASCADE, 
        related_name='test_cases',
        verbose_name="所属题目"
    )
    
    # 核心数据：用于判题机
    input_data = models.TextField(verbose_name="输入数据")
    expected_output = models.TextField(verbose_name="预期输出")
    
    # 标记是否为公开示例
    is_sample = models.BooleanField(default=False, verbose_name="是否为示例用例") 
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # 按 ID 排序以保证判题顺序一致性
        ordering = ['id'] 
        verbose_name = "测试用例"
        verbose_name_plural = "测试用例"

    def __str__(self):
        return f"Test Case for {self.problem.title} (ID: {self.id})"