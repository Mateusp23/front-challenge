"use client";

import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Link as HeroLink,
  Tooltip,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useAuth } from "../hooks/useAuth";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const NAV = [
  { href: "/products", label: "Produtos" },
  { href: "/metrics", label: "Métricas" },
];

export function Header() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <>
    <Navbar
      isBordered
      onMenuOpenChange={setIsMenuOpen}
      classNames={{
        wrapper: "w-full max-w-7xl mx-auto px-0",
      }}
      className="bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      {/* Esquerda */}
      <NavbarBrand>
        <Link href="/" className="font-semibold text-inherit">
          Desafio Front-End
        </Link>
      </NavbarBrand>

      {/* Centro (desktop) */}
      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        {isAuthenticated &&
          NAV.map((item) => (
            <NavbarItem key={item.href} isActive={isActive(item.href)}>
              <Link href={item.href} className="text-foreground hover:opacity-90">
                <HeroLink
                  className={isActive(item.href) ? "font-semibold" : "text-foreground/80"}
                >
                  {item.label}
                </HeroLink>
              </Link>
            </NavbarItem>
          ))}
      </NavbarContent>

      <NavbarContent justify="end" className="gap-2">
        {isAuthenticated && (
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            className="sm:hidden"
          />
        )}

        {isAuthenticated && (
          <div className="hidden sm:flex items-center gap-2">
            <Tooltip content="Alternar tema" placement="bottom">
              <div>
                <ThemeSwitcher />
              </div>
            </Tooltip>
            <Tooltip content="Sair" placement="bottom">
              <Button
                isIconOnly
                variant="light"
                color="danger"
                radius="full"
                aria-label="Sair"
                onPress={onOpen}
              >
                <LogOut size={18} />
              </Button>
            </Tooltip>
          </div>
        )}
      </NavbarContent>

      {/* Menu Mobile */}
      {isAuthenticated && (
        <NavbarMenu>
          {NAV.map((item) => (
            <NavbarMenuItem key={item.href} isActive={isActive(item.href)}>
              <Link
                href={item.href}
                className={`w-full py-2 ${isActive(item.href) ? "font-semibold" : "text-foreground/80"}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
          <div className="border-t border-default-200 dark:border-default-600 my-2" />
          <div className="flex items-center gap-3 px-2 py-2">
            <Tooltip content="Alternar tema" placement="bottom">
              <div>
                <ThemeSwitcher />
              </div>
            </Tooltip>
            <Tooltip content="Sair" placement="bottom">
              <Button
                isIconOnly
                variant="light"
                color="danger"
                radius="full"
                aria-label="Sair"
                onPress={onOpen}
              >
                <LogOut size={18} />
              </Button>
            </Tooltip>
          </div>
        </NavbarMenu>
      )}
    </Navbar>

    {/* Modal de confirmação de logout */}
    <Modal isOpen={isOpen} onClose={onClose} size="sm" placement="center">
      <ModalContent>
        <ModalHeader>Confirmar saída</ModalHeader>
        <ModalBody>
          <p>Deseja realmente sair?</p>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancelar
          </Button>
          <Button
            color="danger"
            startContent={<LogOut size={16} />}
            aria-label="Confirmar saída"
            onPress={async () => {
              try {
                // Chama API de logout (ignora erros)
                await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
              } finally {
                logout();
                toast.success("Sessão encerrada");
                setIsMenuOpen(false);
                onClose();
                router.replace("/login");
              }
            }}
          >
            Sair
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    </>
  );
}
