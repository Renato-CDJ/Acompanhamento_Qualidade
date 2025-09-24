"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import type { CapacitacaoRecord } from "@/lib/data"

interface CapacitacaoChartProps {
  data: CapacitacaoRecord[]
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

export function CapacitacaoChart({ data }: CapacitacaoChartProps) {
  const groupedData = data.reduce(
    (acc, record) => {
      const existing = acc.find((group) => group.carteira === record.carteira)
      if (existing) {
        existing.total += record.quantidade
        if (record.status === "aplicado") {
          existing.aplicados += record.quantidade
        } else {
          existing.pendentes += record.quantidade
        }
        existing.registros += 1
      } else {
        acc.push({
          carteira: record.carteira,
          total: record.quantidade,
          aplicados: record.status === "aplicado" ? record.quantidade : 0,
          pendentes: record.status === "pendente" ? record.quantidade : 0,
          registros: 1,
        })
      }
      return acc
    },
    [] as Array<{
      carteira: string
      total: number
      aplicados: number
      pendentes: number
      registros: number
    }>,
  )

  // Dados para o gráfico de pizza principal
  const pieData = groupedData.map((item, index) => ({
    name: item.carteira,
    value: item.total,
    aplicados: item.aplicados,
    pendentes: item.pendentes,
    eficiencia: item.total > 0 ? Math.round((item.aplicados / item.total) * 100) : 0,
    color: COLORS[index % COLORS.length],
    percentage: 0, // será calculado depois
  }))

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 text-muted-foreground">
        Nenhum dado disponível para o gráfico.
      </div>
    )
  }
  // Calcular percentuais
  const totalGeral = pieData.reduce((sum, item) => sum + item.value, 0)
  pieData.forEach((item) => {
    item.percentage = totalGeral > 0 ? Math.round((item.value / totalGeral) * 100) : 0
  })

  // Dados para gráfico de eficiência (pizza menor)
  const eficienciaData = [
    {
      name: "Aplicados",
      value: groupedData.reduce((sum, item) => sum + item.aplicados, 0),
      color: "hsl(var(--chart-1))",
    },
    {
      name: "Pendentes",
      value: groupedData.reduce((sum, item) => sum + item.pendentes, 0),
      color: "hsl(var(--chart-4))",
    },
  ]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-card p-4 border rounded-lg shadow-lg min-w-48">
          <p className="font-semibold text-base mb-2">{data.name}</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-medium">{data.value}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Percentual:</span>
              <span className="font-medium">{data.percentage}%</span>
            </div>
            {data.aplicados !== undefined && (
              <>
                <div className="flex justify-between">
                  <span className="text-green-600">Aplicados:</span>
                  <span className="font-medium text-green-600">{data.aplicados}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-600">Pendentes:</span>
                  <span className="font-medium text-orange-600">{data.pendentes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">Eficiência:</span>
                  <span className="font-medium text-blue-600">{data.eficiencia}%</span>
                </div>
              </>
            )}
          </div>
        </div>
      )
    }
    return null
  }

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage, name }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    if (percentage < 5) return null // Não mostrar labels para fatias muito pequenas

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${percentage}%`}
      </text>
    )
  }

  return (
    <div className="space-y-6">
      {/* Gráfico Principal - Pizza Analítica */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Distribuição de Treinamentos por Carteira</h4>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={120}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value, entry: any) => (
                    <span style={{ color: entry.color }} className="text-sm">
                      {value} ({entry.payload.percentage}%)
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Status Geral */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Status Geral dos Treinamentos</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={eficienciaData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={30}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                >
                  {eficienciaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [value, name]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Métricas resumidas */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Taxa de Conclusão:</span>
              <span className="font-medium text-green-600">
                {totalGeral > 0 ? Math.round((eficienciaData[0].value / totalGeral) * 100) : 0}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total de Pessoas:</span>
              <span className="font-medium">{totalGeral}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cards de Detalhes por Carteira */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {groupedData.map((item, index) => {
          const eficiencia = item.total > 0 ? (item.aplicados / item.total) * 100 : 0
          const percentage = totalGeral > 0 ? (item.total / totalGeral) * 100 : 0

          return (
            <div key={item.carteira} className="p-4 border rounded-lg bg-card hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm font-medium truncate">{item.carteira}</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Participação:</span>
                  <span className="font-medium">{percentage.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-medium">{item.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Aplicados:</span>
                  <span className="font-medium text-green-600">{item.aplicados}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pendentes:</span>
                  <span className="font-medium text-orange-600">{item.pendentes}</span>
                </div>
                <div className="flex justify-between pt-1 border-t">
                  <span className="text-muted-foreground">Eficiência:</span>
                  <span
                    className={`font-medium ${eficiencia >= 80 ? "text-green-600" : eficiencia >= 60 ? "text-yellow-600" : "text-red-600"}`}
                  >
                    {eficiencia.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
