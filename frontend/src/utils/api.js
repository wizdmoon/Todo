import axios from 'axios'
import { useAuthStore } from '../store/useAuthStore';

const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

api.interceptors.request.use(
    (config) => {

        const userState = useAuthStore.getState().user;
        const token = userState?.accessToken;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;