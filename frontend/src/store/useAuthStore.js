import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            setUser: (user) => set({ user }),
            clear: () => set({ user: null }),
            isAuthed: () => !!get().user,
        }),
        {
            name: 'auth-store', // Storage key
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({ user: state.user }), // user만 저장
        },
    ),
);