import { create } from 'zustand';

export const useCategoryStore = create((set) => ({
  categories: [],
  isManageModalOpen: false, 
  openManageModal: () => set({ isManageModalOpen: true }),
  closeManageModal: () => set({ isManageModalOpen: false }),
  setCategories: (categories) => set({ categories }),
}));