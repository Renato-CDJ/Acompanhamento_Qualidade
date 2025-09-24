"use client"

import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts"
import type { DesligamentoRecord } from "@/lib/data"

interface DesligamentosChartProps {
  data: DesligamentoRecord[]
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

export function DesligamentosChart({ data }: DesligamentosChartProps) {
  const motivosCount = data.reduce(
    (acc, desligamento) => {
      acc[desligamento.motivo] = (acc[desligamento.motivo] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const chartData = Object.entries(motivosCount).map(([motivo, count]) => ({
    name: motivo,
    value: count,
    percentage: ((count / data.length) * 100).toFixed(1),
  }))

  // Análise por carteira
  const carteiraData = data.reduce(
    (acc, desligamento) => {
      const existing = acc.find((item) => item.carteira === desligamento.carteira)
      if (existing) {
        existing.total += 1
        existing.motivos[desligamento.motivo] = (existing.motivos[desligamento.motivo] || 0) + 1
      } else {
        acc.push({
          carteira: desligamento.carteira,
          total: 1,
          motivos: { [desligamento.motivo]: 1 },
        })
      }
      return acc
    },
    [] as Array<{ carteira: string; total: number; motivos: Record<string, number> }>,
  )

  // Análise temporal (por mês)
  const temporalData = data
    .reduce(
      (acc, desligamento) => {
        const mes = new Date(desligamento.data).toLocaleDateString("pt-BR", { month: "2-digit", year: "2-digit" })
        const existing = acc.find((item) => item.mes === mes)
        if (existing) {
          existing.total += 1
        } else {
          acc.push({ mes, total: 1 })
        }
        return acc
      },
      [] as Array<{ mes: string; total: number }>,
    )
    .sort((a, b) => a.mes.localeCompare(b.mes))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-card border border-border rounded-lg p-4 shadow-lg min-w-48">
          <p className="font-semibold text-base mb-2">{data.name || label}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-sm">{entry.name || "Desligamentos"}:</span>
                </div>
                <span className="font-medium">
                  {entry.value}
                  {data.percentage && ` (${data.percentage}%)`}
                </span>
              </div>
            ))}
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

    if (percentage < 8) return null // Não mostrar labels para fatias muito pequenas

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
          <h4 className="text-sm font-medium text-muted-foreground">Distribuição por Motivo de Desligamento</h4>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={120}
                  innerRadius={50}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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

        {/* Resumo de Métricas */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">Resumo Executivo</h4>

          <div className="space-y-3">
            <div className="p-4 border rounded-lg bg-card">
              <div className="text-2xl font-bold text-red-600">{data.length}</div>
              <p className="text-sm text-muted-foreground">Total de Desligamentos</p>
            </div>

            <div className="p-4 border rounded-lg bg-card">
              <div className="text-2xl font-bold text-orange-600">{Object.keys(motivosCount).length}</div>
              <p className="text-sm text-muted-foreground">Tipos de Motivos</p>
            </div>

            <div className="p-4 border rounded-lg bg-card">
              <div className="text-2xl font-bold text-blue-600">{carteiraData.length}</div>
              <p className="text-sm text-muted-foreground">Carteiras Afetadas</p>
            </div>
          </div>

          {/* Top 3 Motivos */}
          <div className="space-y-2">
            <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Top 3 Motivos</h5>
            {chartData
              .sort((a, b) => b.value - a.value)
              .slice(0, 3)
              .map((item, index) => (
                <div key={item.name} className="flex items-center justify-between p-2 rounded bg-muted/50">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-xs truncate">{item.name}</span>
                  </div>
                  <div className="text-xs font-medium">
                    {item.value} ({item.percentage}%)
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Gráficos Secundários */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendência Temporal */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Tendência Temporal</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={temporalData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                <XAxis dataKey="mes" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="hsl(var(--chart-4))"
                  fill="hsl(var(--chart-4))"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Desligamentos por Carteira */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Desligamentos por Carteira</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={carteiraData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                <XAxis dataKey="carteira" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total" fill="hsl(var(--chart-4))" name="Desligamentos" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Cards Detalhados por Carteira */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {carteiraData.map((item, index) => {
          const motivoPrincipal = Object.entries(item.motivos).sort(([, a], [, b]) => b - a)[0]

          return (
            <div key={item.carteira} className="p-4 border rounded-lg bg-card hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm font-medium">{item.carteira}</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-medium text-red-600">{item.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Motivo Principal:</span>
                  <span className="font-medium text-right text-xs max-w-24 truncate" title={motivoPrincipal?.[0]}>
                    {motivoPrincipal?.[0]}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ocorrências:</span>
                  <span className="font-medium">{motivoPrincipal?.[1]}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-muted-foreground">% do Total:</span>
                  <span className="font-medium text-blue-600">{((item.total / data.length) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
