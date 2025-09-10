"use client";

import React from "react";
import { Button } from "@heroui/react";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface LogoutButtonProps {
  variant?: "solid" | "bordered" | "light" | "flat" | "faded" | "shadow" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LogoutButton({ variant = "light", size = "md" }: LogoutButtonProps) {
  const { logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    try {
      logout();
      toast.success("Logout realizado com sucesso!");
      router.push("/login");
    } catch {
      toast.error("Erro ao fazer logout");
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      className="text-red-500 bg-red-50"  
      onClick={handleLogout}
    >
      Sair
    </Button>
  );
}
