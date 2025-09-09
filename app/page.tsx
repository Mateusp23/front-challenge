"use client";

import { Button } from "@heroui/react";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#098989] p-4">
      <div className="flex items-center gap-4">
        <Button onClick={() => router.push("/login")}>Login</Button>
        <ThemeSwitcher />
      </div>
    </div>
  );
}
