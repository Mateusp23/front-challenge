"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../../hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input, Button, Card, Spacer } from "@heroui/react";
import { toast } from "sonner";

const phoneSchema = z
  .object({
    country: z.string().optional(),
    ddd: z.string().optional(),
    number: z.string().optional(),
  })
  .partial();

const registerSchema = z
  .object({
    name: z.string().min(2, "Nome muito curto"),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "Mínimo de 6 caracteres"),
    verifyPassword: z.string().min(6, "Mínimo de 6 caracteres"),
    phone: phoneSchema.optional(),
  })
  .refine((data) => data.password === data.verifyPassword, {
    path: ["verifyPassword"],
    message: "As senhas não coincidem",
  });

type RegisterForm = z.infer<typeof registerSchema>;

function extractErrorMessage(err: unknown): string {
  if (typeof err === "string") return err;
  if (err && typeof err === "object") {
    const maybeAxios = err as { response?: { data?: { message?: string } } ; message?: string };
    return maybeAxios.response?.data?.message || maybeAxios.message || "Erro inesperado";
  }
  return "Erro inesperado";
}

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerAction, isLoading, isAuthenticated } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterForm) => {
    try {
      await registerAction(values);
      toast.success("Cadastro realizado com sucesso!");
      // If register returns token, go to home; otherwise go to login
      if (isAuthenticated) {
        router.push("/");
      } else {
        router.push("/login");
      }
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-semibold">Criar conta</h1>
        <p className="text-sm text-foreground/70">Preencha seus dados abaixo</p>
        <Spacer y={4} />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Input label="Nome" {...register("name") } isInvalid={!!errors.name} errorMessage={errors.name?.message} />
          <Input label="E-mail" type="email" {...register("email")} isInvalid={!!errors.email} errorMessage={errors.email?.message} />
          <Input label="Senha" type="password" {...register("password")} isInvalid={!!errors.password} errorMessage={errors.password?.message} />
          <Input label="Confirmar senha" type="password" {...register("verifyPassword")} isInvalid={!!errors.verifyPassword} errorMessage={errors.verifyPassword?.message} />
          <div className="grid grid-cols-3 gap-2">
            <Input label="País" placeholder="55" {...register("phone.country")} />
            <Input label="DDD" placeholder="11" {...register("phone.ddd")} />
            <Input label="Número" placeholder="912345678" {...register("phone.number")} />
          </div>
          <Button color="primary" type="submit" isLoading={isLoading} className="w-full">Cadastrar</Button>
        </form>
        <Spacer y={4} />
        <p className="text-sm">
          Já tem conta? <Link className="text-primary" href="/login">Entrar</Link>
        </p>
      </Card>
    </div>
  );
}
