// import { useQuery } from '@tanstack/react-query';
// import { useTodoStore } from '../store/useTodoStore';
// import { useEffect } from 'react';
// import api from '../utils/api';

// export default function useTodos(uidx, date) {
//   const setTodos = useTodoStore((state) => state.setTodos);

//   const { data, isLoading, isError, refetch } = useQuery({
//     queryKey: ['todos', uidx, date],
    
//     queryFn: async () => {
//       const res = await api.get(`/todos/${uidx}`, {
//         params: { date: date } 
//       });
//       return res.data;
//     },
    
//     staleTime: 1000 * 60,
//   });

//   useEffect(() => {
//     if (data) {
//       setTodos(data);
//     }
//   }, [data, setTodos]);

//   return { data, isLoading, isError, refetch };
// }

// 1. useMutation, useQueryClient 추가 import
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTodoStore } from '../store/useTodoStore';
import { useEffect } from 'react';
import api from '../utils/api';

export default function useTodos(uidx, date) {
  const setTodos = useTodoStore((state) => state.setTodos);
  const queryClient = useQueryClient(); // 2. 쿼리 클라이언트 가져오기

  // --- [기존 코드 유지] 투두 목록 조회 ---
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['todos', uidx, date],
    queryFn: async () => {
      // 기존에 작성하신 로직 그대로 유지
      const res = await api.get(`/todos/${uidx}`, {
        params: { date: date } 
      });
      return res.data;
    },
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (data) {
      setTodos(data);
    }
  }, [data, setTodos]);


  // --- [새로 추가된 코드] 투두 상태 변경 (Mutation) ---
  const updateStateMutation = useMutation({
    // mutate 함수가 받을 인자: { t_idx, t_state, u_idx }
    mutationFn: async ({ tidx, state, uidx }) => {
      
      // 백엔드 Repository가 원하는 이름(state, uidx)으로 매핑
      const payload = {
        state: state, 
        uidx: uidx     
      };

      // PATCH 요청 보내기 (주소: /api/todos/{t_idx}/state)
      const res = await api.put(`/todos/${tidx}/state`, payload);
      return res.data;
    },
    
    // 성공 시 실행될 함수
    onSuccess: () => {
      // 'todos'라는 키를 가진 모든 데이터(목록)를 무효화 -> 자동으로 다시 조회해서 화면 갱신
      queryClient.invalidateQueries(['todos']);
    },
    
    onError: (error) => {
      console.error("상태 변경 실패:", error);
    }
  });

  return { 
    data, 
    isLoading, 
    isError, 
    refetch,
    // 3. 컴포넌트에서 쓸 수 있도록 함수 내보내기 (이름을 updateTodoState로 변경)
    updateTodoState: updateStateMutation.mutate 
  };
}