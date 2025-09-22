"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TreinadosTable } from "@/components/treinados-table"
import { TreinadosChart } from "@/components/treinados-chart"
import { Users, TrendingUp, CheckCircle, Calendar, Plus, Building2 } from "lucide-react"

interface TreinadosTabProps {
  userRole: "admin" | "user"
}

export function TreinadosTab({ userRole }: TreinadosTabProps) {
  // Mock data - em produção viria do backend
  const [treinadosData] = useState({
    totalTreinados: 145,
    ativosAposTreinamento: 132,
    emPeriodoExperiencia: 13,
    aprovadosDefinitivo: 119,
    porCarteira: [
      { carteira: "CAIXA", total: 45, ativos: 42, experiencia: 3, aprovados: 39 },
      { carteira: "BTG", total: 32, ativos: 30, experiencia: 2, aprovados: 28 },
      { carteira: "WILLBANK", total: 28, ativos: 25, experiencia: 3, aprovados: 22 },
      { carteira: "PEFISA", total: 22, ativos: 20, experiencia: 2, aprovados: 18 },
      { carteira: "SANTANDER", total: 18, ativos: 15, experiencia: 3, aprovados: 12 },
    ],
  })

  const statsCards = [
    {
      title: "Total Treinados",
      value: treinadosData.totalTreinados,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      description: "Funcionários que concluíram treinamento",
    },
    {
      title: "Ativos",
      value: treinadosData.ativosAposTreinamento,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      description: "Funcionários ativos após treinamento",
    },
    {
      title: "Em Experiência",
      value: treinadosData.emPeriodoExperiencia,
      icon: Calendar,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      description: "Em período de experiência",
    },
    {
      title: "Aprovados",
      value: treinadosData.aprovadosDefinitivo,
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      description: "Aprovados definitivamente",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Funcionários Treinados</h2>
          <p className="text-muted-foreground">Acompanhamento de funcionários que concluíram o treinamento</p>
        </div>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Estatísticas por Carteira */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Treinados por Carteira
          </CardTitle>
          <CardDescription>Distribuição de funcionários treinados por carteira</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {treinadosData.porCarteira.map((carteira) => (
              <div
                key={carteira.carteira}
                className="p-4 border border-border rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{carteira.carteira}</h3>
                  <Badge variant="outline">{carteira.total} total</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ativos:</span>
                    <span className="font-medium text-green-500">{carteira.ativos}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Em Experiência:</span>
                    <span className="font-medium text-yellow-500">{carteira.experiencia}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Aprovados:</span>
                    <span className="font-medium text-purple-500">{carteira.aprovados}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{
                        width: carteira.total > 0 ? `${(carteira.ativos / carteira.total) * 100}%` : "0%",
                      }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground text-center">
                    {carteira.total > 0 ? ((carteira.ativos / carteira.total) * 100).toFixed(1) : 0}% ativos
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gráficos e Tabela */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Análise */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Análise de Treinados
            </CardTitle>
            <CardDescription>Distribuição e status dos funcionários treinados</CardDescription>
          </CardHeader>
          <CardContent>
            <TreinadosChart data={treinadosData} />
          </CardContent>
        </Card>

        {/* Tabela de Treinados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Registro de Treinados
              </span>
              {userRole === "admin" && (
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              )}
            </CardTitle>
            <CardDescription>Controle de funcionários que concluíram treinamento</CardDescription>
          </CardHeader>
          <CardContent>
            <TreinadosTable userRole={userRole} />
          </CardContent>
        </Card>
      </div>

      {/* Resumo de Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo de Performance</CardTitle>
          <CardDescription>Indicadores de sucesso do programa de treinamento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-500/5 rounded-lg border border-green-500/20">
              <p className="text-2xl font-bold text-green-500">
                {((treinadosData.ativosAposTreinamento / treinadosData.totalTreinados) * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">Taxa de Retenção</p>
              <p className="text-xs text-muted-foreground mt-1">Funcionários que permaneceram ativos</p>
            </div>
            <div className="text-center p-4 bg-purple-500/5 rounded-lg border border-purple-500/20">
              <p className="text-2xl font-bold text-purple-500">
                {((treinadosData.aprovadosDefinitivo / treinadosData.totalTreinados) * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">Taxa de Aprovação</p>
              <p className="text-xs text-muted-foreground mt-1">Funcionários aprovados definitivamente</p>
            </div>
            <div className="text-center p-4 bg-yellow-500/5 rounded-lg border border-yellow-500/20">
              <p className="text-2xl font-bold text-yellow-500">
                {((treinadosData.emPeriodoExperiencia / treinadosData.totalTreinados) * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">Em Avaliação</p>
              <p className="text-xs text-muted-foreground mt-1">Funcionários em período de experiência</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
