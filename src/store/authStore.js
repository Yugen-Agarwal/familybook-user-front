import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      pendingUserId: null,

      setAuth: (token, user) => set({ token, user }),
      setPendingUser: (userId) => set({ pendingUserId: userId }),
      logout: () => set({ token: null, user: null, pendingUserId: null }),
    }),
    { name: 'fb-auth' }
  )
);
