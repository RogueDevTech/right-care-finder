import { create } from "zustand";
import { ISession } from "@/interfaces";

interface AuthState {
  session: ISession;
  setSession: (session: ISession) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: {
    isLoggedIn: false,
  },
  setSession: (session) => set({ session }),
  clearAuth: () =>
    set({
      session: { isLoggedIn: false },
    }),
}));
