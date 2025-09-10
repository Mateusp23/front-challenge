"use client";

import React from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Spinner, Link as HeroLink } from "@heroui/react";
import { LogoutButton } from "./LogoutButton";
import { useAuth } from "../hooks/useAuth";
import Link from "next/link";
import { ThemeSwitcher } from "@/app/components/ThemeSwitcher";

export function Header() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><Spinner /></div>;
  }

  return (
    <Navbar>
      <NavbarBrand>
        <Link href="/" className="font-bold text-inherit">
          Desafio Front-End
        </Link>
        <ThemeSwitcher />
      </NavbarBrand>
      
          <NavbarContent className="hidden sm:flex gap-4" justify="center">
            {isAuthenticated && (
              <NavbarItem>
                <Link href="/products">
                  <HeroLink className="text-foreground">
                    Produtos
                  </HeroLink>
                </Link>
              </NavbarItem>
            )}
          </NavbarContent>

          <NavbarContent justify="end">
            {isAuthenticated ? (
              <>
                {user && (
                  <NavbarItem className="hidden sm:flex">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Olá, {user.name.split(" ")[0]}
                    </span>
                  </NavbarItem>
                )}
                <NavbarItem>
                  <LogoutButton />
                </NavbarItem>
              </>
            ) : (
              <>
                <NavbarItem>
                  <Link href="/login">
                    <HeroLink className="text-primary">
                      Entrar
                    </HeroLink>
                  </Link>
                </NavbarItem>
                <NavbarItem>
                  <Link href="/register">
                    <HeroLink className="text-primary">
                      Cadastrar
                    </HeroLink>
                  </Link>
                </NavbarItem>
              </>
            )}
          </NavbarContent>
    </Navbar>
  );
}
