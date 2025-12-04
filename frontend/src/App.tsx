// src/App.tsx
import React, { useState, useEffect } from 'react';
import './App.css';
import LoginPage from './pages/LoginPage.tsx'; 
import SubmissionForm from './components/SubmissionForm.tsx'; 

// 🎯 新增：检查当前是否有有效 Token 的 Hook
const useAuthStatus = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    // 使用 useEffect 监听 localStorage 的变化（或简单地在加载时检查）
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        // 简单检查 Token 存在性
        setIsAuthenticated(!!token); 
    }, []);

    // 实际应用中会包含一个用于退出登录的函数
    const logout = () => {
        localStorage.clear();
        setIsAuthenticated(false);
        // 刷新页面或重定向到登录页
        window.location.reload(); 
    };

    return { isAuthenticated, logout, setIsAuthenticated };
};

function App() {
    const { isAuthenticated, logout, setIsAuthenticated } = useAuthStatus();

    // 当 LoginPage 成功登录后，我们需要通知 App 重新渲染
    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    return (
        <div className="App" style={{ padding: '20px' }}>
            <h1>OJ System 前端测试</h1>
            <hr />

            {isAuthenticated ? (
                // 状态 1: 已登录，显示提交表单和退出按钮
                <>
                    <button onClick={logout} style={{ marginBottom: '20px', padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none' }}>
                        退出登录 ({localStorage.getItem('accessToken')?.substring(0, 5)}...)
                    </button>
                    <SubmissionForm />
                </>
            ) : (
                // 状态 2: 未登录，显示登录页面
                <LoginPage onLoginSuccess={handleLoginSuccess} />
            )}
        </div>
    );
}

export default App;