import { useMutation } from '@tanstack/react-query';
import api from '../utils/api';
import { useAuthStore } from '../store/useAuthStore';

export default function useSignIn(opts = {}) {
    const setUser = useAuthStore((s) => s.setUser);

    return useMutation({
        mutationKey: ['user', 'login'],
        mutationFn: async ({ id, password }) => {
            const res = await api.post('/users/login', { id, password });
            return res.data.data; 
        },
        onSuccess: async (data) => {
            setUser(data);
            opts.onSuccess?.(data);
        },
        onError: (err) => {
            const msg = err.response?.data?.message || '로그인 실패';
            opts.onError?.(msg);
        },
    });
}