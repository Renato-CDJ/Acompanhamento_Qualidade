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
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import type { OperadorTreinado } from "@/lib/data"

interface TreinadosChartProps {
  data: OperadorTreinado[]
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

export function TreinadosChart({ data }: TreinadosChartProps) {
  const groupedData = data.reduce(
    (acc, operador) => {
      const existing = acc.find((group) => group.carteira === operador.carteira)
      if (existing) {
        existing.total += 1
        existing[operador.assunto] = (existing[operador.assunto] || 0) + 1
      } else {
        acc.push({
          carteira: operador.carteira,
          total: 1,
          [operador.assunto]: 1,
        })
      }
      return acc
    },
    [] as Array<Record<string, any>>,
  )

  const chartData = groupedData.map((item) => ({
    Carteira: item.carteira,
    "Treinamento Inicial": item["Treinamento Inicial"] || 0,
    Calibragem: item.Calibragem || 0,
    Feedback: item.Feedback || 0,
    Sarb: item.Sarb || 0,
    "Prevenção ao Assédio": item["Prevenção ao Assédio"] || 0,
    Total: item.total,
  }))

  // Dados para gráfico de pizza - distribuição por assunto
  const assuntosData = data.reduce(
    (acc, operador) => {
      const existing = acc.find((item) => item.name === operador.assunto)
      if (existing) {
        existing.value += 1
      } else {
        acc.push({
          name: operador.assunto,
          value: 1,
        })
      }
      return acc
    },
    [] as Array<{ name: string; value: number }>,
  )

  // Dados para radar chart - cobertura por carteira
  const radarData = groupedData.map((item) => ({
    carteira: item.carteira,
    "Treinamento Inicial": ((item["Treinamento Inicial"] || 0) / item.total) * 100,
    Calibragem: ((item.Calibragem || 0) / item.total) * 100,
    Feedback: ((item.Feedback || 0) / item.total) * 100,
    Sarb: ((item.Sarb || 0) / item.total) * 100,
    Prevenção: ((item["Prevenção ao Assédio"] || 0) / item.total) * 100,
  }))

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
                <span className="font-medium">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Gráfico Principal - Barras por Carteira */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">Treinamentos por Carteira e Assunto</h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
              <XAxis dataKey="Carteira" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="Treinamento Inicial"
                fill="hsl(var(--chart-1))"
                name="Treinamento Inicial"
                radius={[2, 2, 0, 0]}
              />
              <Bar dataKey="Calibragem" fill="hsl(var(--chart-2))" name="Calibragem" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Feedback" fill="hsl(var(--chart-3))" name="Feedback" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Sarb" fill="hsl(var(--chart-4))" name="Sarb" radius={[2, 2, 0, 0]} />
              <Bar
                dataKey="Prevenção ao Assédio"
                fill="hsl(var(--chart-5))"
                name="Prevenção ao Assédio"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráficos Secundários */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pizza - Distribuição por Assunto */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Distribuição por Tipo de Treinamento</h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assuntosData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                >
                  {assuntosData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
        </div>

        {/* Radar - Cobertura por Carteira */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Cobertura de Treinamentos (%)</h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData[0] ? [radarData[0]] : []}>
                <PolarGrid className="stroke-muted" />
                <PolarAngleAxis dataKey="subject" className="text-xs" />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  className="text-xs"
                  tickFormatter={(value) => `${value}%`}
                />
                <Radar
                  name="Cobertura"
                  dataKey="Treinamento Inicial"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name="Calibragem"
                  dataKey="Calibragem"
                  stroke="hsl(var(--chart-2))"
                  fill="hsl(var(--chart-2))"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip
                  formatter={(value) => [`${Number(value).toFixed(1)}%`, "Cobertura"]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Cards de Resumo por Carteira */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {groupedData.map((item, index) => {
          const totalTreinamentos = Object.keys(item)
            .filter((key) => key !== "carteira" && key !== "total")
            .reduce((sum, key) => sum + (item[key] || 0), 0)

          const cobertura = item.total > 0 ? (totalTreinamentos / (item.total * 5)) * 100 : 0 // 5 tipos de treinamento

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
                  <span className="text-muted-foreground">Operadores:</span>
                  <span className="font-medium">{item.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Treinamentos:</span>
                  <span className="font-medium">{totalTreinamentos}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-muted-foreground">Cobertura:</span>
                  <span
                    className={`font-medium ${cobertura >= 80 ? "text-green-600" : cobertura >= 60 ? "text-yellow-600" : "text-red-600"}`}
                  >
                    {cobertura.toFixed(1)}%
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
