import { useMutation } from '@tanstack/react-query';
import api from '../utils/api';

export default function useJoin(opts = {}) {

    return useMutation({
        mutationKey: ['user', 'join'],
        mutationFn: async ({ id, password, name }) => {
            const res = await api.post('/users', { id, password, name }, { withCredentials: true });
            return res.data;
        },
        onSuccess: async (data) => {
            opts.onSuccess?.(data);
        },
        onError: (err) => {
            console.error("회원가입 에러:", err);
            
            const msg = err.response?.data?.message || '회원가입 중 오류가 발생했습니다.';
            opts.onError?.(msg);
        },
    });

}