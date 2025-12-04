// src/components/SubmissionForm.tsx
import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';


function SubmissionForm() {
    // 状态管理
    const [code, setCode] = useState('// 输入您的代码...');
    const [language, setLanguage] = useState('python');
    const [problemId, setProblemId] = useState(1);
    const [message, setMessage] = useState('');
    const [isLoading,setIsLoading]=useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('正在提交...');
        setIsLoading(true);

        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            setMessage('❌ 提交失败: 未找到 Access Token，请先登录。');
            setIsLoading(false);
            return;
        }

        try {
            // 🎯 API 提交的触发点
            const response = await axiosInstance.post(
                '/submissions/', 
                // 提交的数据
                {
                    problem: problemId,
                    code: code,
                    language: language,
                },
            );

            // 提交成功 (HTTP 201 Created)
            setMessage(`✅ 提交成功! 记录ID: ${response.data.id}。`);
            console.log('完整响应:', response.data);

        } catch (error: any) {
            console.error('提交失败:', error.response);
            // 错误处理，区分 Token 失效和其他错误
            if (error.response && error.response.status === 401) {
                setMessage('❌ 提交失败: Token 已过期，请重新登录。');
            } else {
                const errorMsg = error.response?.data?.detail || error.message;
                setMessage(`❌ 提交失败: ${errorMsg}`);
            }
        }finally {
            setIsLoading(false);
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