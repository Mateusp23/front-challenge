"use client";

import Link from "next/link";
import { Divider, Button } from "@heroui/react";
import { Github, LucideIcon, ExternalLink, Linkedin } from "lucide-react";

function IconLink({
  href,
  label,
  Icon,
}: { href: string; label: string; Icon: LucideIcon }) {
  return (
    <Button
      as={Link}
      href={href}
      target="_blank"
      rel="noreferrer"
      isIconOnly
      variant="light"
      radius="full"
      aria-label={label}
      className="hover:opacity-90"
    >
      <Icon size={18} />
    </Button>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-foreground/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="py-6 grid gap-4 sm:grid-cols-3 items-center">
          {/* Brand */}
          <div className="text-sm text-foreground/70">
            <span className="font-semibold text-foreground">
              Desafio Front-End
            </span>
            <span className="mx-2">•</span>
            <span>Next.js • HeroUI • Zod</span>
          </div>

          {/* Links */}
          <nav className="flex justify-start sm:justify-center gap-4 text-sm">
            <Link href="/products" className="text-foreground/80 hover:text-foreground">
              Produtos
            </Link>
            <Link href="/metrics" className="text-foreground/80 hover:text-foreground">
              Métricas
            </Link>
            <Link href="/" className="text-foreground/80 hover:text-foreground">
              Início
            </Link>
          </nav>

          {/* Socials */}
          <div className="flex justify-start items-center sm:justify-end gap-2">
            <IconLink
              href="https://github.com/Mateusp23/front-challenge"
              label="GitHub do projeto"
              Icon={Github}
            />
            <IconLink
              href="https://docs.google.com/document/d/1wAS4hNg7GyyoF7xLhFAOSoL237jivyY8/edit?tab=t.0"
              label="Linkedin do Desenvolvedor"
              Icon={Linkedin}
            />
            <Button
              as={Link}
              href="https://api-teste-front-production.up.railway.app/docs/"
              target="_blank"
              rel="noreferrer"
              variant="light"
              size="sm"
              startContent={<ExternalLink size={14} />}
            >
              Docs da API
            </Button>
            <Button
              as={Link}
              href="https://docs.google.com/document/d/1wAS4hNg7GyyoF7xLhFAOSoL237jivyY8/edit?tab=t.0"
              target="_blank"
              rel="noreferrer"
              variant="light"
              size="sm"
              startContent={<ExternalLink size={14} />}
            >
              Docs do Desafio
            </Button>
          </div>
        </div>

        <Divider className="mb-4" />

        <div className="pb-6 text-xs text-foreground/60 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <p>© {year} Desafio Front-End. Todos os direitos reservados.</p>
          <p className="text-foreground/50">
            Feito com Next.js 15, Tailwind v4 e HeroUI.
          </p>
        </div>
      </div>
    </footer>
  );
}
