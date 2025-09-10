"use client";


import { Loading } from "@/components/Loading";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function Page() {
  const { user } = useAuth();
  const { isLoading, shouldRender } = useAuthGuard();

  if (isLoading) {
    return (
      <Loading />
    );
  }

  if (!shouldRender) {
    return (
      <Loading />
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen p-8">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {user && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
              <h2 className="text-2xl font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Bem-vindo, {user.name}!
              </h2>
              <p className="text-blue-600 dark:text-blue-300">
                Sua melhor plataforma de gestão de produtos.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
