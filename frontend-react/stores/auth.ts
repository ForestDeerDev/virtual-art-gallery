import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@/types";

interface AuthState {
  token: string | null;
  userInfo: User | null;
  setAuth: (token: string, userInfo: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userInfo: null,
      setAuth: (token, userInfo) => set({ token, userInfo }),
      clearAuth: () => set({ token: null, userInfo: null }),
    }),
    {
      name: "art-gallery-auth",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
