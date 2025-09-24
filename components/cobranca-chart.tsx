"use client"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import type { EstatisticaCobranca } from "@/lib/data"

interface CobrancaChartProps {
  data: EstatisticaCobranca[]
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

export function CobrancaChart({ data }: CobrancaChartProps) {
  const groupedData = data.reduce(
    (acc, item) => {
      const existing = acc.find((group) => group.carteira === item.carteira)
      if (existing) {
        existing.total += item.total
        existing.presentes += item.presentes
        existing.faltas += item.faltas
        existing.registros += 1
      } else {
        acc.push({
          carteira: item.carteira,
          total: item.total,
          presentes: item.presentes,
          faltas: item.faltas,
          registros: 1,
        })
      }
      return acc
    },
    [] as Array<{
      carteira: string
      total: number
      presentes: number
      faltas: number
      registros: number
    }>,
  )

  const pieData = groupedData.map((item) => ({
    name: item.carteira,
    value: item.total,
    presentes: item.presentes,
    faltas: item.faltas,
    eficiencia: item.total > 0 ? Math.round((item.presentes / item.total) * 100) : 0,
  }))

  const barData = groupedData.map((item) => {
    const presenceRate = item.total > 0 ? (item.presentes / item.total) * 100 : 0
    const absRate = item.total > 0 ? (item.faltas / item.total) * 100 : 0

    return {
      Carteira: item.carteira,
      "Total Funcionários": item.total,
      Presentes: item.presentes,
      Faltas: item.faltas,
      "Taxa Presença (%)": Math.round(presenceRate * 10) / 10,
      "Taxa ABS (%)": Math.round(absRate * 10) / 10,
    }
  })

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-card p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{`${data.name || label}`}</p>
          <p className="text-sm text-muted-foreground">{`Total: ${data.value || data["Total Funcionários"]}`}</p>
          {data.presentes && (
            <>
              <p className="text-sm text-green-600">{`Presentes: ${data.presentes}`}</p>
              <p className="text-sm text-red-600">{`Faltas: ${data.faltas}`}</p>
              <p className="text-sm text-blue-600">{`Eficiência: ${data.eficiencia}%`}</p>
            </>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Distribuição por Carteira</h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Performance por Carteira</h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="Carteira" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                  formatter={(value, name) => [typeof value === "number" ? value.toFixed(1) : value, name]}
                />
                <Legend />
                <Bar dataKey="Presentes" fill="hsl(var(--chart-1))" name="Presentes" />
                <Bar dataKey="Faltas" fill="hsl(var(--chart-4))" name="Faltas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {groupedData.map((item, index) => {
          const eficiencia = item.total > 0 ? (item.presentes / item.total) * 100 : 0
          return (
            <div key={item.carteira} className="p-3 border rounded-lg bg-card">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-sm font-medium">{item.carteira}</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-medium">{item.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Presentes:</span>
                  <span className="font-medium text-green-600">{item.presentes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Eficiência:</span>
                  <span className="font-medium text-blue-600">{eficiencia.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
