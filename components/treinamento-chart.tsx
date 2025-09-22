"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface Carteira {
  id: string
  nome: string
  total: number
  aplicados: number
  pendentes: number
}

interface TreinamentoChartProps {
  data: Carteira[]
}

export function TreinamentoChart({ data }: TreinamentoChartProps) {
  const barData = data.map((carteira) => ({
    nome: carteira.nome,
    aplicados: carteira.aplicados,
    pendentes: carteira.pendentes,
    total: carteira.total,
  }))

  const pieData = [
    {
      name: "Aplicados",
      value: data.reduce((acc, carteira) => acc + carteira.aplicados, 0),
      color: "#10b981",
    },
    {
      name: "Pendentes",
      value: data.reduce((acc, carteira) => acc + carteira.pendentes, 0),
      color: "#f59e0b",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Gráfico de Pizza */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={5} dataKey="value">
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} treinamentos`, "Quantidade"]} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legenda */}
      <div className="flex justify-center gap-4">
        {pieData.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-sm text-muted-foreground">
              {item.name}: {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Gráfico de Barras por Carteira */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="nome" className="text-xs" angle={-45} textAnchor="end" height={80} />
            <YAxis className="text-xs" />
            <Tooltip
              formatter={(value, name) => [`${value} treinamentos`, name === "aplicados" ? "Aplicados" : "Pendentes"]}
            />
            <Bar dataKey="aplicados" fill="#10b981" radius={[2, 2, 0, 0]} />
            <Bar dataKey="pendentes" fill="#f59e0b" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
