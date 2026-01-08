import { create } from 'zustand';

export const useTodoStore = create((set) => ({
  todos: [],
  isCreateModalOpen: false, 
  openCreateModal: () => set({ isCreateModalOpen: true }),
  closeCreateModal: () => set({ isCreateModalOpen: false }),
  setTodos: (todos) => set({ todos }),
}));