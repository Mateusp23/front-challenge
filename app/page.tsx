"use client";

import { Loading } from "@/components/Loading";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Chip,
} from "@heroui/react";
import {
  Plus,
  Upload,
  Link2,
  Image as ImageIcon,
  CheckCircle2,
  BarChart3,
} from "lucide-react";
import { Footer } from "@/components/Footer";

export default function Page() {
  const { user } = useAuth();
  const { isLoading, shouldRender } = useAuthGuard();

  if (isLoading || !shouldRender) return <Loading />;

  return (
    <>
      <Header />
      <main className="p-6 sm:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Boas-vindas */}
          {user && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
              <h2 className="text-2xl font-semibold text-blue-800 dark:text-blue-200">
                Bem-vindo, {user.name.split(" ")[0]}!
              </h2>
              <p className="text-blue-700/80 dark:text-blue-300 mt-1">
                Use os passos abaixo para cadastrar seus produtos rapidamente.
              </p>
            </div>
          )}

          <Card className="overflow-hidden p-4 sm:p-6">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold">Como cadastrar um produto</h3>
                <p className="text-foreground/70 text-xs sm:text-sm">
                  Siga o guia rápido abaixo. Leva menos de 1 minuto.
                </p>
              </div>
              <Chip color="primary" variant="flat" className="hidden sm:inline-flex">
                Guia rápido
              </Chip>
            </CardHeader>

            <CardBody className="space-y-4 sm:space-y-5">
              <ol className="space-y-3 sm:space-y-4" aria-label="Passo a passo para cadastrar produto">
                {/* PASSO 1 */}
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="mt-0.5 sm:mt-1 rounded-full bg-primary text-primary-foreground w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-[10px] sm:text-xs font-bold">
                    1
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium flex flex-wrap items-center gap-1.5 sm:gap-2">
                      Acesse{" "}
                      <Link href="/products" className="text-primary underline underline-offset-2">
                        Produtos
                      </Link>
                      <span className="hidden xs:inline">e clique em</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[11px] sm:text-xs font-semibold">
                        <Plus size={14} /> Novo Produto
                      </span>
                    </p>
                    <p className="text-foreground/70 text-xs sm:text-sm">
                      O botão fica no canto superior direito da tela de produtos.
                    </p>
                  </div>
                </li>

                {/* PASSO 2 */}
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="mt-0.5 sm:mt-1 rounded-full bg-primary text-primary-foreground w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-[10px] sm:text-xs font-bold">
                    2
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium">
                      Preencha <strong>Título</strong> e <strong>Descrição</strong>.
                    </p>
                    <p className="text-foreground/70 text-xs sm:text-sm">
                      Os campos são validados automaticamente (Zod).
                    </p>
                  </div>
                </li>

                {/* PASSO 3 */}
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="mt-0.5 sm:mt-1 rounded-full bg-primary text-primary-foreground w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-[10px] sm:text-xs font-bold">
                    3
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium flex flex-wrap items-center gap-1.5 sm:gap-2">
                      Escolha a <strong>Thumbnail</strong>:
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-default-100 text-foreground text-[11px] sm:text-xs">
                        <Upload size={14} /> Upload
                      </span>
                      ou
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-default-100 text-foreground text-[11px] sm:text-xs">
                        <Link2 size={14} /> URL
                      </span>
                    </p>
                    <p className="text-foreground/70 text-[11px] sm:text-sm flex items-center gap-2">
                      <ImageIcon size={14} /> Formatos: JPG/PNG/GIF • até 5&nbsp;MB.
                    </p>
                  </div>
                </li>

                {/* PASSO 4 */}
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="mt-0.5 sm:mt-1 rounded-full bg-primary text-primary-foreground w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-[10px] sm:text-xs font-bold">
                    4
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium flex flex-wrap items-center gap-1.5 sm:gap-2">
                      Clique em{" "}
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary text-primary-foreground text-[11px] sm:text-xs font-semibold">
                        Criar Produto
                      </span>
                      <CheckCircle2 size={16} className="text-success" />
                    </p>
                    <p className="text-foreground/70 text-xs sm:text-sm">
                      O produto aparecerá na lista e você poderá <em>editar</em> ou <em>excluir</em> quando quiser.
                    </p>
                  </div>
                </li>
              </ol>

              {/* Ações rápidas */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-1 sm:pt-2">
                <Button
                  as={Link}
                  href="/products"
                  color="primary"
                  startContent={<Plus size={16} />}
                  className="w-full sm:w-auto min-h-[44px]"
                  size="sm"
                >
                  Ir para Produtos
                </Button>
                <Button
                  as={Link}
                  href="/metrics"
                  variant="flat"
                  startContent={<BarChart3 size={16} />}
                  className="w-full sm:w-auto min-h-[44px]"
                  size="sm"
                >
                  Ver Métricas
                </Button>
              </div>
            </CardBody>
          </Card>

          <div className="text-center text-sm text-foreground/60">
            Dica: você pode filtrar, ordenar e usar o menu de ações (⋮) na lista de produtos.
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
