"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Users, UserCheck, GraduationCap } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  ComposedChart,
  Legend,
} from "recharts"

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

interface AnalyticsOverviewProps {
  data: {
    totalFuncionarios: number
    totalAtivos: number
    totalTreinamentos: number
    taxaRotatividade: number
    tendenciaRotatividade: "up" | "down"
    distribuicaoTurnos: Array<{ name: string; value: number }>
    evolucaoMensal: Array<{ mes: string; ativos: number; desligamentos: number; treinamentos: number }>
  }
}

export function AnalyticsOverview({ data }: AnalyticsOverviewProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-4 shadow-lg min-w-48">
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

  // Dados para gráfico combinado
  const combinedData = data.evolucaoMensal.map((item) => ({
    ...item,
    "Taxa Rotatividade": item.ativos > 0 ? ((item.desligamentos / item.ativos) * 100).toFixed(1) : 0,
    "Eficiência Treinamento": item.ativos > 0 ? ((item.treinamentos / item.ativos) * 100).toFixed(1) : 0,
  }))

  return (
    <div className="space-y-6">
      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Funcionários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalFuncionarios}</div>
            <p className="text-xs text-muted-foreground">{data.totalAtivos} ativos</p>
            <div className="mt-2 w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(data.totalAtivos / data.totalFuncionarios) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funcionários Ativos</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{data.totalAtivos}</div>
            <p className="text-xs text-muted-foreground">
              {((data.totalAtivos / data.totalFuncionarios) * 100).toFixed(1)}% do total
            </p>
            <Badge variant="secondary" className="mt-2">
              {data.totalFuncionarios - data.totalAtivos} inativos
            </Badge>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Treinamentos</CardTitle>
            <GraduationCap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{data.totalTreinamentos}</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
            <Badge variant="outline" className="mt-2">
              {data.totalAtivos > 0 ? ((data.totalTreinamentos / data.totalAtivos) * 100).toFixed(1) : 0}% cobertura
            </Badge>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa Rotatividade</CardTitle>
            {data.tendenciaRotatividade === "up" ? (
              <TrendingUp className="h-4 w-4 text-red-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-green-500" />
            )}
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${data.tendenciaRotatividade === "up" ? "text-red-600" : "text-green-600"}`}
            >
              {data.taxaRotatividade}%
            </div>
            <Badge variant={data.tendenciaRotatividade === "up" ? "destructive" : "default"}>
              {data.tendenciaRotatividade === "up" ? "Aumentou" : "Diminuiu"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição por Turnos - Pizza Melhorada */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Turnos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.distribuicaoTurnos}
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
                  {data.distribuicaoTurnos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Evolução Mensal - Gráfico Combinado */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={combinedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                <XAxis dataKey="mes" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="ativos"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.3}
                  stroke="hsl(var(--chart-1))"
                  name="Ativos"
                />
                <Bar dataKey="treinamentos" fill="hsl(var(--chart-2))" name="Treinamentos" />
                <Line
                  type="monotone"
                  dataKey="desligamentos"
                  stroke="hsl(var(--chart-4))"
                  strokeWidth={3}
                  name="Desligamentos"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Comparativo por Carteira - Melhorado */}
      <Card>
        <CardHeader>
          <CardTitle>Performance por Carteira</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={[
                { carteira: "CAIXA", ativos: 45, treinados: 40, desligamentos: 5, eficiencia: 88.9 },
                { carteira: "BTG", ativos: 32, treinados: 30, desligamentos: 3, eficiencia: 93.8 },
                { carteira: "BMG", ativos: 28, treinados: 25, desligamentos: 4, eficiencia: 89.3 },
                { carteira: "CARREFOUR", ativos: 35, treinados: 32, desligamentos: 2, eficiencia: 91.4 },
                { carteira: "MERCANTIL", ativos: 25, treinados: 22, desligamentos: 3, eficiencia: 88.0 },
              ]}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
              <XAxis dataKey="carteira" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="ativos" fill="hsl(var(--chart-1))" name="Ativos" radius={[2, 2, 0, 0]} />
              <Bar dataKey="treinados" fill="hsl(var(--chart-2))" name="Treinados" radius={[2, 2, 0, 0]} />
              <Bar dataKey="desligamentos" fill="hsl(var(--chart-4))" name="Desligamentos" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Métricas de Tendência */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Crescimento de Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+12%</div>
            <p className="text-xs text-muted-foreground">vs. mês anterior</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Eficiência Treinamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">87%</div>
            <p className="text-xs text-muted-foreground">cobertura média</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Retenção</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">92%</div>
            <p className="text-xs text-muted-foreground">taxa de permanência</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
