"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "../../../stores/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Input,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Spacer,
} from "@heroui/react";
import { toast } from "sonner";

const phoneSchema = z.object({
  country: z.string().optional(),
  ddd: z.string().optional(),
  number: z.string().optional(),
}).partial();

const registerSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo de 6 caracteres"),
  verifyPassword: z.string().min(6, "Mínimo de 6 caracteres"),
  phone: phoneSchema.optional(),
}).refine((d) => d.password === d.verifyPassword, {
  path: ["verifyPassword"],
  message: "As senhas não coincidem",
});

type RegisterForm = z.infer<typeof registerSchema>;

function extractErrorMessage(err: unknown): string {
  if (typeof err === "string") return err;
  if (err && typeof err === "object") {
    const e = err as { response?: { data?: { message?: string } }; message?: string };
    return e.response?.data?.message || e.message || "Erro inesperado";
  }
  return "Erro inesperado";
}

export default function RegisterPage() {
  const router = useRouter();
  const registerAction = useAuthStore((s) => s.register);
  const loading = useAuthStore((s) => s.loading);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterForm) => {
    try {
      await registerAction(values);
      toast.success("Cadastro realizado com sucesso!");
      router.push("/login");
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-start gap-1">
          <h1 className="text-2xl font-semibold">Criar conta</h1>
          <p className="text-sm text-foreground/70">Preencha seus dados abaixo</p>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <Input
              label="Nome"
              variant="bordered"
              {...register("name")}
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
            />
            <Input
              label="E-mail"
              type="email"
              variant="bordered"
              {...register("email")}
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
            />
            <Input
              label="Senha"
              type="password"
              variant="bordered"
              {...register("password")}
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
            />
            <Input
              label="Confirmar senha"
              type="password"
              variant="bordered"
              {...register("verifyPassword")}
              isInvalid={!!errors.verifyPassword}
              errorMessage={errors.verifyPassword?.message}
            />
            <div className="grid grid-cols-3 gap-2">
              <Input label="País" placeholder="55" variant="bordered" {...register("phone.country")} />
              <Input label="DDD" placeholder="11" variant="bordered" {...register("phone.ddd")} />
              <Input label="Número" placeholder="912345678" variant="bordered" {...register("phone.number")} />
            </div>
            <Button color="primary" type="submit" isLoading={loading} className="w-full">
              Cadastrar
            </Button>
          </form>
        </CardBody>

        <CardFooter className="flex justify-center">
          <p className="text-sm">
            Já tem conta?{" "}
            <Link className="text-primary" href="/login">
              Entrar
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
