import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api, endpoints } from "../lib/api";

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  verifyPassword: string;
  phone?: {
    country?: string;
    ddd?: string;
    number?: string;
  };
};

export type LoginInput = {
  email: string;
  password: string;
};

type AuthState = {
  token: string | null;
  loading: boolean;
  error: string | null;
  register: (input: RegisterInput) => Promise<void>;
  login: (input: LoginInput) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      loading: false,
      error: null,
      async register(input) {
        set({ loading: true, error: null });
        try {
          await api.post(endpoints.register, input);
          set({ loading: false });
        } catch (e: unknown) {
          const message = (e as any)?.response?.data?.message || (e as Error).message || "Erro ao cadastrar";
          set({ error: message, loading: false });
          throw e;
        }
      },
      async login(input) {
        set({ loading: true, error: null });
        try {
          const { data } = await api.post(endpoints.login, input);
          const token: string | undefined = data?.token;
          if (!token) throw new Error("Token não retornado pela API.");
          set({ token, loading: false });
        } catch (e: unknown) {
          const message = (e as any)?.response?.data?.message || (e as Error).message || "Erro ao logar";
          set({ error: message, loading: false });
          throw e;
        }
      },
      logout() {
        set({ token: null });
      },
    }),
    {
      name: "auth", // localStorage key
      partialize: (state) => ({ token: state.token }),
      skipHydration: true,
      storage: typeof window !== "undefined" ? undefined : undefined,
    }
  )
);
