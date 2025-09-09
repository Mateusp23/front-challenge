"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";

/**
 * Hook para proteger rotas que exigem autenticação
 * Redireciona automaticamente para login se o usuário não estiver autenticado
 */
export function useAuthGuard() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  return {
    isLoading,
    isAuthenticated,
    shouldRender: isAuthenticated, // Só renderiza se autenticado
  };
}
