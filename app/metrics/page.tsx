"use client";

import React from "react";
import { Card, CardBody } from "@heroui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useProductMetrics } from "../../hooks/useProductMetrics";
import { useAuthGuard } from "../../hooks/useAuthGuard";
import { Spinner } from "@heroui/react";
import { Header } from "@/components/Header";

export default function MetricsPage() {
  const { isLoading: authLoading, shouldRender } = useAuthGuard();
  const { monthly, stockDistribution, colors } = useProductMetrics();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!shouldRender) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Métricas</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Visão geral simples relacionada a produtos (dados mockados).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vendas por mês (barras) */}
            <Card className="p-4">
              <CardBody className="h-80">
                <h3 className="text-lg font-semibold mb-3">Produtos vendidos por mês</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthly} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip formatter={(v: number) => [`${v}`, "Unidades"]} />
                    <Legend />
                    <Bar dataKey="sold" name="Vendidos" fill={colors[0]} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>

            {/* Receita por mês (linha) */}
            <Card className="p-4">
              <CardBody className="h-80">
                <h3 className="text-lg font-semibold mb-3">Receita por mês (R$)</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthly} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip formatter={(v: number) => [`R$ ${v.toLocaleString("pt-BR")}`, "Receita"]} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" name="Receita" stroke={colors[1]} strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          </div>

          {/* Distribuição de estoque (pizza) */}
          <Card className="p-4">
            <CardBody className="h-96">
              <h3 className="text-lg font-semibold mb-3">Distribuição de estoque</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stockDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {stockDistribution.map((_, i) => (
                      <Cell key={i} fill={colors[i % colors.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <RechartsTooltip formatter={(v: number) => [`${v}`, "Qtd."]} />
                </PieChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}


