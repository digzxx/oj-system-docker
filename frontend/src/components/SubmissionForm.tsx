// src/components/SubmissionForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

// 🚨 注意：为了测试，我们暂时将 Token 硬编码在这里
// 成功后再引入登录状态管理
const HARDCODED_ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzY0Njc4NTA2LCJpYXQiOjE3NjQ2NzQ5MDYsImp0aSI6ImJlZTRhMmU5MDM5YTQ3ZTliYmQ0MWRiMTkxMGY4ZDA3IiwidXNlcl9pZCI6IjEifQ.lWoPMZacW4hJ5tASue8w2vNTQFVFLMcvkOD_8gcD65s"; 

function SubmissionForm() {
    // 状态管理
    const [code, setCode] = useState('// 输入您的代码...');
    const [language, setLanguage] = useState('python');
    const [problemId, setProblemId] = useState(1);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('正在提交...');

        try {
            // 🎯 API 提交的触发点
            const response = await axios.post(
                'http://localhost/api/submissions/', 
                // 提交的数据
                {
                    problem: problemId,
                    code: code,
                    language: language,
                },
                // 🎯 认证头部的触发点
                {
                    headers: {
                        'Content-Type': 'application/json',
                        // 显式携带 Bearer Token
                        'Authorization': `Bearer ${HARDCODED_ACCESS_TOKEN}`
                    }
                }
            );

            // 提交成功 (HTTP 201 Created)
            setMessage(`✅ 提交成功! 记录ID: ${response.data.id}。`);
            console.log('完整响应:', response.data);

        } catch (error) {
            console.error('提交失败:', error.response);
            // 错误处理，显示来自后端的错误信息 (如 401 Unauthorized, 400 Bad Request)
            const errorMsg = error.response?.data?.detail || error.message;
            setMessage(`❌ 提交失败: ${errorMsg}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ margin: '20px', padding: '20px', border: '1px solid #ccc' }}>
            <h2>代码提交 (测试模式)</h2>
            <p>请确保您已将代码中的 ACCESS_TOKEN 替换为有效 Token。</p>
            
            {/* 问题ID选择 (简化为固定值) */}
            <label>问题 ID: {problemId}</label><br/><br/>
            
            {/* 语言选择 */}
            <label>编程语言:</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ marginLeft: '10px' }}>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
            </select><br/><br/>

            {/* 代码输入框 */}
            <textarea 
                value={code} 
                onChange={(e) => setCode(e.target.value)} 
                rows="10" 
                cols="60" 
                placeholder="在此处输入代码..."
            /><br/><br/>
            
            {/* 提交按钮 */}
            <button type="submit" style={{ padding: '10px 20px' }}>提交代码</button>
            
            {/* 结果信息 */}
            <p style={{ marginTop: '15px', fontWeight: 'bold' }}>状态: {message}</p>
        </form>
    );
}

export default SubmissionForm;