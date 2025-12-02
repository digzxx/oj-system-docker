#!/bin/bash

# --- 配置部分 ---
# 1. 替换为您上次成功登录获取的 Access Token
ACCESS_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzY0Njc4NTA2LCJpYXQiOjE3NjQ2NzQ5MDYsImp0aSI6ImJlZTRhMmU5MDM5YTQ3ZTliYmQ0MWRiMTkxMGY4ZDA3IiwidXNlcl9pZCI6IjEifQ.lWoPMZacW4hJ5tASue8w2vNTQFVFLMcvkOD_8gcD65s" 

# 2. 确保 problem ID 存在
PROBLEM_ID=1

# 3. 提交的代码和语言
CODE="print(\"This code was submitted by an authenticated user.\")"
LANGUAGE="python"

# --- 执行部分 ---

# 检查 Token 是否已替换
if [ "$ACCESS_TOKEN" == "<YOUR_ACCESS_TOKEN_HERE>" ]; then
    echo "🚨 错误：请在 submit.sh 脚本中替换 ACCESS_TOKEN 的值。"
    exit 1
fi

echo "🚀 正在向 /api/submissions/ 发送已认证的 POST 请求..."
echo "Token 头部: Authorization: Bearer ${ACCESS_TOKEN:0:15}..."
echo "--------------------------------------------------------"

# 使用 curl 发送请求
curl -i -s -X POST http://localhost/api/submissions/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "problem": 1,
    "code": "print(\"This code was submitted by an authenticated user.\")", 
    "language": "python"
  }'

echo
echo "✅ 测试完成。"