"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

interface QuadroChartProps {
  data: {
    total: number
    ativos: number
    ferias: number
    afastamento: number
    inss: number
  }
  area: string
  turno?: string
  registros?: Array<{
    tipo: "total" | "ativos" | "ferias" | "afastamento" | "inss"
    quantidade: number
    turno?: string
    carteira?: string
    capacity?: number
    presentes?: number
    faltas?: number
    observacao?: string
  }>
}

export function QuadroChart({ data, area, turno, registros }: QuadroChartProps) {
  type Registro = {
    tipo: "total" | "ativos" | "ferias" | "afastamento" | "inss"
    quantidade: number
    turno?: string
    carteira?: string
    capacity?: number
    presentes?: number
    faltas?: number
    observacao?: string
  };
  const filtered: Registro[] = Array.isArray(registros)
    ? registros.filter((r) => !turno || r.turno === turno)
    : [];
  let stats = {
    total: 0,
    ativos: 0,
    ferias: 0,
    afastamento: 0,
    inss: 0,
  };
  filtered.forEach((r) => {
    if (r.tipo === "total") stats.total += r.quantidade;
    if (r.tipo === "ativos") stats.ativos += r.quantidade;
    if (r.tipo === "ferias") stats.ferias += r.quantidade;
    if (r.tipo === "afastamento") stats.afastamento += r.quantidade;
    if (r.tipo === "inss") stats.inss += r.quantidade;
  });
  // fallback para dados mock se não houver registros
  const chartStats = filtered.length > 0 ? stats : data;
  const pieData = [
    { name: "Ativos", value: chartStats.ativos, color: "#10b981" },
    { name: "Férias", value: chartStats.ferias, color: "#f59e0b" },
    { name: "Afastamento", value: chartStats.afastamento, color: "#f97316" },
    { name: "INSS", value: chartStats.inss, color: "#8b5cf6" },
  ];
  const barData = [
    {
      name: "Ativos",
      quantidade: chartStats.ativos,
      porcentagem: ((chartStats.ativos / (chartStats.total || 1)) * 100).toFixed(1),
    },
    {
      name: "Férias",
      quantidade: chartStats.ferias,
      porcentagem: ((chartStats.ferias / (chartStats.total || 1)) * 100).toFixed(1),
    },
    {
      name: "Afastamento",
      quantidade: chartStats.afastamento,
      porcentagem: ((chartStats.afastamento / (chartStats.total || 1)) * 100).toFixed(1),
    },
    {
      name: "INSS",
      quantidade: chartStats.inss,
      porcentagem: ((chartStats.inss / (chartStats.total || 1)) * 100).toFixed(1),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Gráfico de Pizza */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} funcionários`, "Quantidade"]} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legenda personalizada */}
      <div className="grid grid-cols-2 gap-2">
        {pieData.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-sm text-muted-foreground">
              {item.name}: {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Gráfico de Barras */}
      <div className="h-48 mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              formatter={(value, name) => [
                name === "quantidade" ? `${value} funcionários` : `${value}%`,
                name === "quantidade" ? "Quantidade" : "Porcentagem",
              ]}
            />
            <Bar dataKey="quantidade" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
