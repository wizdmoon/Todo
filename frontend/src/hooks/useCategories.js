import { useQuery } from '@tanstack/react-query';
import { useCategoryStore } from '../store/useCategoryStore';
import { useEffect } from 'react';
import api from '../utils/api';

export default function useCategories(uidx) {
  const setCategories = useCategoryStore((state) => state.setCategories);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['categories', uidx],
    queryFn: async () => {
            const res = await api.get(`/categories/${uidx}`);
            return res.data;
        },
    staleTime: 1000 * 60 * 5, // 5분 동안은 다시 조회 안 함 (캐싱)

    enabled: !!uidx,
  });

  // 데이터가 로드되면 Store에 저장 (선택 사항이지만 추천)
  useEffect(() => {
    if (data) {
      setCategories(data);
    }
  }, [data, setCategories]);

  return { data, isLoading, isError };
}