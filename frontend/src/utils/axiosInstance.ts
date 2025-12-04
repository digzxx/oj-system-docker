// src/utils/axiosInstance.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost/api';

// 1. 创建基础实例
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// 锁定刷新过程，防止并发请求都去刷新 Token
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: any) => void; reject: (reason?: any) => void; config: any }> = [];

// 将失败的请求添加到队列
const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            // 使用新的 Token 重新发送请求
            prom.config.headers['Authorization'] = `Bearer ${token}`;
            prom.resolve(axiosInstance(prom.config));
        }
    });
    failedQueue = [];
};

/* -------------------------------------------------------------------------- */
/* 2. 请求拦截器 (Request Interceptor) - 自动附加 Access Token              */
/* -------------------------------------------------------------------------- */
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        
        // 排除刷新 Token 的请求，避免死循环
        if (accessToken && config.url !== '/token/refresh/') { 
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


/* -------------------------------------------------------------------------- */
/* 3. 响应拦截器 (Response Interceptor) - Token 自动刷新逻辑                  */
/* -------------------------------------------------------------------------- */
axiosInstance.interceptors.response.use(
    (response) => {
        // 如果响应成功，直接返回
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        
        // 🎯 触发点 2: 捕获 401 Unauthorized 错误，且不能是刷新 Token 自身的请求
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            
            // 设置一个标记，防止多个请求同时触发刷新
            originalRequest._retry = true; 
            const refreshToken = localStorage.getItem('refreshToken');

            // 如果没有 Refresh Token 或正在刷新，将请求加入队列
            if (!refreshToken) {
                // 没有 Refresh Token，导向登录
                localStorage.clear();
                // 实际应用中：window.location.href = '/login'; 
                return Promise.reject(error);
            }

            // 如果没有正在刷新，则开始刷新
            if (!isRefreshing) {
                isRefreshing = true;
                
                try {
                    // 🎯 触发点 3: 调用刷新 Token 接口
                    const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
                        refresh: refreshToken,
                    });

                    const { access: newAccessToken, refresh: newRefreshToken } = response.data;
                    
                    // 🎯 触发点 4: 存储新的 Tokens
                    localStorage.setItem('accessToken', newAccessToken);
                    localStorage.setItem('refreshToken', newRefreshToken);

                    // 刷新成功后，处理队列中所有失败的请求
                    processQueue(null, newAccessToken);
                    
                    // 使用新的 Token 重新发送原始请求
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosInstance(originalRequest);

                } catch (refreshError) {
                    // 刷新失败，清空 Tokens 并导向登录
                    localStorage.clear();
                    processQueue(refreshError);
                    // 实际应用中：window.location.href = '/login'; 
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
                
            } else {
                // 如果正在刷新，将请求推入队列，等待刷新完成
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject, config: originalRequest });
                });
            }
        }
        
        return Promise.reject(error);
    }
);

export default axiosInstance;