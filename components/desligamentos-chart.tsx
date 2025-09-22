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
  Area,
  AreaChart,
} from "recharts"

interface DesligamentosChartProps {
  data: {
    totalDesligamentos: number
    comAvisoPrevia: number
    semAvisoPrevia: number
    porCarteira: Array<{
      carteira: string
      total: number
      comAviso: number
      semAviso: number
    }>
  }
}

export function DesligamentosChart({ data }: DesligamentosChartProps) {
  const pieData = [
    {
      name: "Com Aviso Prévio",
      value: data.comAvisoPrevia,
      color: "#3b82f6",
    },
    {
      name: "Sem Aviso Prévio",
      value: data.semAvisoPrevia,
      color: "#f97316",
    },
  ]

  const barData = data.porCarteira.map((carteira) => ({
    nome: carteira.carteira,
    total: carteira.total,
    comAviso: carteira.comAviso,
    semAviso: carteira.semAviso,
  }))

  // Dados simulados para evolução temporal
  const evolutionData = [
    { mes: "Jan", desligamentos: 22, comAviso: 15, semAviso: 7 },
    { mes: "Fev", desligamentos: 25, comAviso: 16, semAviso: 9 },
    { mes: "Mar", desligamentos: 20, comAviso: 14, semAviso: 6 },
    { mes: "Abr", desligamentos: 28, comAviso: 18, semAviso: 10 },
    { mes: "Mai", desligamentos: 24, comAviso: 17, semAviso: 7 },
  ]

  return (
    <div className="space-y-8">
      {/* Gráfico de Pizza - Distribuição de Aviso Prévio */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Distribuição por Aviso Prévio</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} desligamentos`, "Quantidade"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-muted-foreground">
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico de Barras por Carteira */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Desligamentos por Carteira</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="nome" className="text-xs" angle={-45} textAnchor="end" height={80} />
                <YAxis className="text-xs" />
                <Tooltip
                  formatter={(value, name) => {
                    const labels = {
                      total: "Total",
                      comAviso: "Com Aviso",
                      semAviso: "Sem Aviso",
                    }
                    return [`${value} desligamentos`, labels[name as keyof typeof labels] || name]
                  }}
                />
                <Bar dataKey="comAviso" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                <Bar dataKey="semAviso" fill="#f97316" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Gráfico de Evolução Temporal */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Evolução dos Desligamentos</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={evolutionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="mes" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                formatter={(value, name) => {
                  const labels = {
                    desligamentos: "Total Desligamentos",
                    comAviso: "Com Aviso Prévio",
                    semAviso: "Sem Aviso Prévio",
                  }
                  return [`${value} desligamentos`, labels[name as keyof typeof labels] || name]
                }}
              />
              <Area
                type="monotone"
                dataKey="desligamentos"
                stackId="1"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.3}
              />
              <Area type="monotone" dataKey="comAviso" stackId="2" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="semAviso" stackId="2" stroke="#f97316" fill="#f97316" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Métricas Adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-red-500/5 rounded-lg border border-red-500/20">
          <p className="text-2xl font-bold text-red-500">{data.totalDesligamentos}</p>
          <p className="text-sm text-muted-foreground">Total de Desligamentos</p>
        </div>
        <div className="text-center p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
          <p className="text-2xl font-bold text-blue-500">
            {((data.comAvisoPrevia / data.totalDesligamentos) * 100).toFixed(1)}%
          </p>
          <p className="text-sm text-muted-foreground">Taxa de Aviso Prévio</p>
        </div>
        <div className="text-center p-4 bg-orange-500/5 rounded-lg border border-orange-500/20">
          <p className="text-2xl font-bold text-orange-500">
            {((data.semAvisoPrevia / data.totalDesligamentos) * 100).toFixed(1)}%
          </p>
          <p className="text-sm text-muted-foreground">Desligamentos Imediatos</p>
        </div>
      </div>
    </div>
  )
}
