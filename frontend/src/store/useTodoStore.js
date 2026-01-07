import { create } from 'zustand';

export const useTodoStore = create((set) => ({
  todos: [],
  setTodos: (todos) => set({ todos }),
}));