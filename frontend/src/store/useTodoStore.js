import { create } from 'zustand';

export const useTodoStore = create((set) => ({
  todos: [],
  isCreateModalOpen: false, 
  openCreateModal: () => set({ isCreateModalOpen: true }),
  closeCreateModal: () => set({ isCreateModalOpen: false }),

  isInfoModalOpen: false,
  selectedTidx: null,
  openInfoModal: (tidx = null) => set({ 
    isInfoModalOpen: true, 
    selectedTidx: tidx
  }),
  closeInfoModal: () => set({ 
    isInfoModalOpen: false, 
    selectedTidx: null
  }),






  setTodos: (todos) => set({ todos }),
}));