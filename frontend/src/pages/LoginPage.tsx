// src/pages/LoginPage.tsx (完整的实现)
import React, { useState } from 'react';
import { login } from '../api/auth';

interface LoginPageProps {
    onLoginSuccess: () => void;
}

function LoginPage({ onLoginSuccess }: LoginPageProps) {
    // 🎯 缺失部分 1: 状态定义
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setIsLoading(true);

        if (!username || !password) {
            setMessage('用户名和密码不能为空。');
            setIsLoading(false);
            return;
        }

        try {
            const token = await login(username, password);
            setMessage(`✅ 登录成功! Access Token 已存储。`);
            
            // 登录成功后调用回调函数
            onLoginSuccess(); 
            
        } catch (error: any) {
            setMessage(`❌ 登录失败: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // 🎯 缺失部分 2: 渲染逻辑 (return 语句)
    return (
        <form onSubmit={handleSubmit} style={{ margin: '50px', padding: '30px', border: '1px solid #ddd', maxWidth: '400px' }}>
            <h2>用户登录</h2>
            
            <label>
                用户名:
                <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    disabled={isLoading}
                    style={{ marginLeft: '10px', padding: '5px' }}
                />
            </label><br/><br/>
            
            <label>
                密码:
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    disabled={isLoading}
                    style={{ marginLeft: '10px', padding: '5px' }}
                />
            </label><br/><br/>
            
            <button type="submit" disabled={isLoading} style={{ padding: '8px 20px' }}>
                {isLoading ? '登录中...' : '登录'}
            </button>
            
            <p style={{ marginTop: '15px', color: message.startsWith('❌') ? 'red' : 'green' }}>
                {message}
            </p>
        </form>
    );
}

export default LoginPage;