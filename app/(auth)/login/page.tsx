"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "../../../stores/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input, Button, Card, Spacer } from "@heroui/react";


import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo de 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

function extractErrorMessage(err: unknown): string {
  if (typeof err === "string") return err;
  if (err && typeof err === "object") {
    const maybeAxios = err as { response?: { data?: { message?: string } } ; message?: string };
    return maybeAxios.response?.data?.message || maybeAxios.message || "Erro inesperado";
  }
  return "Erro inesperado";
}

export default function LoginPage() {
  const router = useRouter();
  const loginAction = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginForm) => {
    try {
      await loginAction(values);
      toast.success("Login realizado com sucesso!");
      router.push("/");
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-semibold">Entrar</h1>
        <p className="text-sm text-foreground/70">Acesse sua conta</p>
        <Spacer y={4} />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Input className="bg-white" label="E-mail" type="email" {...register("email")} isInvalid={!!errors.email} errorMessage={errors.email?.message} />
          <Input className="bg-white" label="Senha" type="password" {...register("password")} isInvalid={!!errors.password} errorMessage={errors.password?.message} />
          <Button color="primary" type="submit" isLoading={loading} className="w-full">Entrar</Button>
        </form>
        <Spacer y={4} />
        <p className="text-sm">
          Não tem conta? <Link className="text-primary" href="/register">Criar conta</Link>
        </p>
      </Card>
    </div>
  );
}
