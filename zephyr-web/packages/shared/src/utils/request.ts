import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getToken, removeToken } from './auth';

/** 统一响应体格式 */
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  errorCode?: string;
  errorMessage?: string;
  timestamp: number;
}

/** 请求配置 */
export interface RequestConfig extends AxiosRequestConfig {
  /** 是否忽略错误提示 */
  silentError?: boolean;
}

const baseURL = import.meta.env.VITE_API_BASE || '/api';

const instance: AxiosInstance = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const res = response.data;
    if (!res.success) {
      const msg = res.errorMessage || '请求失败';
      if (!response.config.silentError) {
        console.error('[API Error]', msg);
      }
      return Promise.reject(new Error(msg));
    }
    return res as any;
  },
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = '/login';
    }
    const msg = error.response?.data?.errorMessage || error.message || '网络错误';
    console.error('[Network Error]', msg);
    return Promise.reject(error);
  }
);

/** 通用请求方法 */
export const request = {
  get<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return instance.get(url, config) as any;
  },
  post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return instance.post(url, data, config) as any;
  },
  put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return instance.put(url, data, config) as any;
  },
  delete<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return instance.delete(url, config) as any;
  },
};

export default request;
