"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts"
import type { EstatisticaCaixa } from "@/lib/data"

interface CaixaChartProps {
  data: EstatisticaCaixa[]
}

export function CaixaChart({ data }: CaixaChartProps) {
  const chartData = data.map((item) => ({
    data: new Date(item.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
    turno: item.turno,
    label: `${new Date(item.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })} - ${item.turno}`,
    Ativos: item.ativos,
    Férias: item.ferias,
    Afastamento: item.afastamento,
    Total: item.total,
    "Taxa Atividade": item.total > 0 ? Math.round((item.ativos / item.total) * 100) : 0,
    "Taxa Ausência": item.total > 0 ? Math.round(((item.ferias + item.afastamento) / item.total) * 100) : 0,
  }))

  // Dados agregados por turno
  const dadosPorTurno = data.reduce(
    (acc, item) => {
      const existing = acc.find((group) => group.turno === item.turno)
      if (existing) {
        existing.total += item.total
        existing.ativos += item.ativos
        existing.ferias += item.ferias
        existing.afastamento += item.afastamento
        existing.registros += 1
      } else {
        acc.push({
          turno: item.turno,
          total: item.total,
          ativos: item.ativos,
          ferias: item.ferias,
          afastamento: item.afastamento,
          registros: 1,
        })
      }
      return acc
    },
    [] as Array<{
      turno: string
      total: number
      ativos: number
      ferias: number
      afastamento: number
      registros: number
    }>,
  )

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-4 border rounded-lg shadow-lg min-w-48">
          <p className="font-semibold text-base mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-sm">{entry.name}:</span>
                </div>
                <span className="font-medium">
                  {typeof entry.value === "number" && entry.name.includes("Taxa") ? `${entry.value}%` : entry.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )
    }
    return null
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 text-muted-foreground">
        Nenhum dado disponível para o gráfico.
      </div>
    )
  }
  return (
    <div className="space-y-6">
      {/* Gráfico Principal - Barras Empilhadas */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">Evolução Temporal - Distribuição de Funcionários</h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
              <XAxis dataKey="label" className="text-xs" angle={-45} textAnchor="end" height={80} interval={0} />
              <YAxis className="text-xs" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="Ativos" stackId="a" fill="hsl(var(--chart-1))" name="Ativos" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Férias" stackId="a" fill="hsl(var(--chart-2))" name="Férias" radius={[0, 0, 0, 0]} />
              <Bar
                dataKey="Afastamento"
                stackId="a"
                fill="hsl(var(--chart-3))"
                name="Afastamento"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráficos de Tendência */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Taxa de Atividade */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Tendência - Taxa de Atividade</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                <XAxis dataKey="data" className="text-xs" />
                <YAxis className="text-xs" domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} formatter={(value) => [`${value}%`, "Taxa de Atividade"]} />
                <Area
                  type="monotone"
                  dataKey="Taxa Atividade"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Comparação por Turno */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Comparação por Turno</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosPorTurno} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                <XAxis dataKey="turno" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="ativos" fill="hsl(var(--chart-1))" name="Ativos" radius={[2, 2, 0, 0]} />
                <Bar dataKey="ferias" fill="hsl(var(--chart-2))" name="Férias" radius={[2, 2, 0, 0]} />
                <Bar dataKey="afastamento" fill="hsl(var(--chart-3))" name="Afastamento" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Cards de Métricas por Turno */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dadosPorTurno.map((turno, index) => {
          const taxaAtividade = turno.total > 0 ? (turno.ativos / turno.total) * 100 : 0
          const taxaAusencia = turno.total > 0 ? ((turno.ferias + turno.afastamento) / turno.total) * 100 : 0

          return (
            <div key={turno.turno} className="p-4 border rounded-lg bg-card hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-4 rounded-full bg-primary flex-shrink-0" />
                <span className="text-sm font-medium capitalize">{turno.turno}</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-medium">{turno.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ativos:</span>
                  <span className="font-medium text-green-600">{turno.ativos}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Férias:</span>
                  <span className="font-medium text-blue-600">{turno.ferias}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Afastamento:</span>
                  <span className="font-medium text-orange-600">{turno.afastamento}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-muted-foreground">Taxa Atividade:</span>
                  <span
                    className={`font-medium ${taxaAtividade >= 80 ? "text-green-600" : taxaAtividade >= 60 ? "text-yellow-600" : "text-red-600"}`}
                  >
                    {taxaAtividade.toFixed(1)}%
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
