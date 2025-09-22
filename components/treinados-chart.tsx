"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

interface TreinadosChartProps {
  data: {
    totalTreinados: number
    ativosAposTreinamento: number
    emPeriodoExperiencia: number
    aprovadosDefinitivo: number
    porCarteira: Array<{
      carteira: string
      total: number
      ativos: number
      experiencia: number
      aprovados: number
    }>
  }
}

export function TreinadosChart({ data }: TreinadosChartProps) {
  const pieData = [
    {
      name: "Aprovados",
      value: data.aprovadosDefinitivo,
      color: "#8b5cf6",
    },
    {
      name: "Em Experiência",
      value: data.emPeriodoExperiencia,
      color: "#f59e0b",
    },
    {
      name: "Outros",
      value: data.totalTreinados - data.aprovadosDefinitivo - data.emPeriodoExperiencia,
      color: "#6b7280",
    },
  ]

  const barData = data.porCarteira.map((carteira) => ({
    nome: carteira.carteira,
    total: carteira.total,
    ativos: carteira.ativos,
    aprovados: carteira.aprovados,
    experiencia: carteira.experiencia,
  }))

  // Dados simulados para evolução temporal
  const evolutionData = [
    { mes: "Jan", treinados: 120, aprovados: 100 },
    { mes: "Fev", treinados: 125, aprovados: 108 },
    { mes: "Mar", treinados: 135, aprovados: 115 },
    { mes: "Abr", treinados: 140, aprovados: 119 },
    { mes: "Mai", treinados: 145, aprovados: 119 },
  ]

  return (
    <div className="space-y-6">
      {/* Gráfico de Pizza - Status dos Treinados */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={5} dataKey="value">
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} funcionários`, "Quantidade"]} />
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
              formatter={(value, name) => {
                const labels = {
                  total: "Total Treinados",
                  ativos: "Ativos",
                  aprovados: "Aprovados",
                  experiencia: "Em Experiência",
                }
                return [`${value} funcionários`, labels[name as keyof typeof labels] || name]
              }}
            />
            <Bar dataKey="total" fill="#3b82f6" radius={[2, 2, 0, 0]} />
            <Bar dataKey="ativos" fill="#10b981" radius={[2, 2, 0, 0]} />
            <Bar dataKey="aprovados" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Linha - Evolução */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={evolutionData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="mes" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              formatter={(value, name) => [`${value} funcionários`, name === "treinados" ? "Treinados" : "Aprovados"]}
            />
            <Line type="monotone" dataKey="treinados" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="aprovados" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
