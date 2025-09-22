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
}

export function QuadroChart({ data, area }: QuadroChartProps) {
  const pieData = [
    { name: "Ativos", value: data.ativos, color: "#10b981" },
    { name: "Férias", value: data.ferias, color: "#f59e0b" },
    { name: "Afastamento", value: data.afastamento, color: "#f97316" },
    { name: "INSS", value: data.inss, color: "#8b5cf6" },
  ]

  const barData = [
    {
      name: "Ativos",
      quantidade: data.ativos,
      porcentagem: ((data.ativos / data.total) * 100).toFixed(1),
    },
    {
      name: "Férias",
      quantidade: data.ferias,
      porcentagem: ((data.ferias / data.total) * 100).toFixed(1),
    },
    {
      name: "Afastamento",
      quantidade: data.afastamento,
      porcentagem: ((data.afastamento / data.total) * 100).toFixed(1),
    },
    {
      name: "INSS",
      quantidade: data.inss,
      porcentagem: ((data.inss / data.total) * 100).toFixed(1),
    },
  ]

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
