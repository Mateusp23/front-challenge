"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button, Tooltip } from "@heroui/react";
import { Moon, Sun } from "lucide-react";

export function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <Tooltip content={isDark ? "Modo claro" : "Modo escuro"} placement="bottom">
      <Button
        isIconOnly
        radius="full"
        variant="light"
        aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="transition-transform duration-300 hover:rotate-12"
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </Button>
    </Tooltip>
  );
}
