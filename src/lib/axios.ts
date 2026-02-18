// src/lib/axios.ts
import axios from 'axios';
import { getCookie } from 'cookies-next';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Token Ekleme
api.interceptors.request.use((config) => {
  const token = getCookie('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Hata Yönetimi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // İleride buraya Token Yenileme (Refresh) mekanizması eklenecek
    return Promise.reject(error);
  }
);