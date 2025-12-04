// src/api/auth.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost/api';

/**
 * 尝试登录并存储 JWT Tokens
 * @param username 用户名
 * @param password 密码
 * @returns 成功则返回 Access Token 字符串
 */
export async function login(username, password): Promise<string> {
    try {
        const response = await axios.post(`${API_BASE_URL}/token/`, {
            username: username,
            password: password,
        });

        const { access, refresh } = response.data;
        
        // 🎯 触发点 1: 存储 Tokens 到本地存储
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);

        return access;

    } catch (error) {
        console.error("Login failed:", error.response?.data || error.message);
        throw new Error(error.response?.data?.detail || "登录失败，请检查用户名和密码。");
    }
}