import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCategoryStore } from '../store/useCategoryStore';
import { useEffect } from 'react';
import api from '../utils/api';

export default function useCategories(uidx) {
  const setCategories = useCategoryStore((state) => state.setCategories);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['categories', uidx],
    queryFn: async () => {
            const res = await api.get(`/categories/${uidx}`);
            return res.data;
        },
    staleTime: 1000 * 60 * 5, // 5분 동안은 다시 조회 안 함 (캐싱)

    enabled: !!uidx,
  });

  const createCategory = useMutation({
    mutationFn: async (newCategory) => {
      console.log('newCategory: ', newCategory);
      const res = await api.post('/categories', newCategory);
      return res.data;
    },
    onSuccess: () => {
      if (uidx) {
    queryClient.invalidateQueries({ queryKey: ['categories', uidx] });
  }
      alert('카테고리가 추가되었습니다!');
    },
    onError: (err) => alert(err.message)
  });

  const deleteCategory = useMutation({
    mutationFn: async (cidx) => {
      const res = await api.delete(`/categories/${cidx}`, {
        data: { uidx: uidx }
      });
      return res.data;
    },
    onSuccess: () => {
    queryClient.invalidateQueries(['categories', uidx]);
    alert('일정이 삭제되었습니다!');
    },
    onError: (err) => alert(err.message)
  })

  const updateCategory = useMutation({
    mutationFn: async (data) => {
      // 1. 모달에서 넘겨준 데이터: { cidx: 1, cname: "수정할이름", uidx: 5 }
      // 여기서 cidx만 따로 빼내고, 나머지는 bodyData에 담습니다.
      const { cidx, ...bodyData } = data;

      // 2. 백엔드 요청
      // 라우터가 '/:cidx' 형식이므로 URL 뒤에 cidx를 붙입니다.
      // 컨트롤러가 req.body를 categoryData로 쓰므로 bodyData를 두 번째 인자로 보냅니다.
      const res = await api.put(`/categories/${cidx}`, bodyData);
      
      return res.data;
    },
    onSuccess: () => {
      // 3. 성공 시 카테고리 목록 새로고침
      // (기존에 useQuery 키를 ['categories', uidx]로 쓰고 계신다고 가정)
      queryClient.invalidateQueries(['categories', uidx]);
      // alert("카테고리가 수정되었습니다."); // 필요하면 주석 해제
    },
    onError: (error) => {
      console.error("카테고리 수정 실패:", error);
      alert("카테고리 수정 중 오류가 발생했습니다.");
    }
  });

  // 데이터가 로드되면 Store에 저장 (선택 사항이지만 추천)
  useEffect(() => {
    if (data) {
      setCategories(data);
    }
  }, [data, setCategories]);

  return { data, isLoading, isError, createCategory, deleteCategory, updateCategory };
}