"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DesligamentosTable } from "@/components/desligamentos-table"
import { DesligamentosChart } from "@/components/desligamentos-chart"
import { MotivosAnalysis } from "@/components/motivos-analysis"
import { UserMinus, TrendingDown, AlertTriangle, FileText, Plus, BarChart3 } from "lucide-react"

interface DesligamentosTabProps {
  userRole: "admin" | "user"
}

export function DesligamentosTab({ userRole }: DesligamentosTabProps) {
  // Mock data - em produção viria do backend
  const [desligamentosData] = useState({
    totalDesligamentos: 28,
    comAvisoPrevia: 18,
    semAvisoPrevia: 10,
    porCarteira: [
      { carteira: "CAIXA", total: 8, comAviso: 5, semAviso: 3 },
      { carteira: "BTG", total: 6, comAviso: 4, semAviso: 2 },
      { carteira: "WILLBANK", total: 5, comAviso: 3, semAviso: 2 },
      { carteira: "PEFISA", total: 4, comAviso: 3, semAviso: 1 },
      { carteira: "SANTANDER", total: 5, comAviso: 3, semAviso: 2 },
    ],
    motivosFrequentes: [
      { motivo: "Inadequação ao cargo", quantidade: 8, percentual: 28.6 },
      { motivo: "Problemas de performance", quantidade: 6, percentual: 21.4 },
      { motivo: "Questões disciplinares", quantidade: 4, percentual: 14.3 },
      { motivo: "Pedido de demissão", quantidade: 5, percentual: 17.9 },
      { motivo: "Reestruturação", quantidade: 3, percentual: 10.7 },
      { motivo: "Outros", quantidade: 2, percentual: 7.1 },
    ],
  })

  const [activeTab, setActiveTab] = useState("overview")

  const statsCards = [
    {
      title: "Total Desligamentos",
      value: desligamentosData.totalDesligamentos,
      icon: UserMinus,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      description: "Desligamentos no período",
    },
    {
      title: "Com Aviso Prévio",
      value: desligamentosData.comAvisoPrevia,
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      description: "Desligamentos com aviso",
    },
    {
      title: "Sem Aviso Prévio",
      value: desligamentosData.semAvisoPrevia,
      icon: AlertTriangle,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      description: "Desligamentos sem aviso",
    },
    {
      title: "Taxa de Rotatividade",
      value: "12.3%",
      icon: TrendingDown,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      description: "Baseado no quadro atual",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Controle de Desligamentos</h2>
          <p className="text-muted-foreground">Análise e controle de desligamentos de funcionários</p>
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

      {/* Tabs para diferentes visualizações */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="analysis">Análise</TabsTrigger>
          <TabsTrigger value="motivos">Motivos</TabsTrigger>
          <TabsTrigger value="registros">Registros</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Desligamentos por Carteira */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Desligamentos por Carteira
              </CardTitle>
              <CardDescription>Distribuição de desligamentos por área de atuação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {desligamentosData.porCarteira.map((carteira) => (
                  <div
                    key={carteira.carteira}
                    className="p-4 border border-border rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{carteira.carteira}</h3>
                      <Badge variant="outline" className="text-red-500 border-red-500/50">
                        {carteira.total} desligamentos
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Com Aviso:</span>
                        <span className="font-medium text-blue-500">{carteira.comAviso}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Sem Aviso:</span>
                        <span className="font-medium text-orange-500">{carteira.semAviso}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{
                            width: carteira.total > 0 ? `${(carteira.comAviso / carteira.total) * 100}%` : "0%",
                          }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground text-center">
                        {carteira.total > 0 ? ((carteira.comAviso / carteira.total) * 100).toFixed(1) : 0}% com aviso
                        prévio
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resumo de Aviso Prévio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  Controle de Aviso Prévio
                </CardTitle>
                <CardDescription>Análise de cumprimento de aviso prévio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
                    <div>
                      <p className="font-semibold text-blue-500">Com Aviso Prévio</p>
                      <p className="text-sm text-muted-foreground">Desligamentos regulares</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-500">{desligamentosData.comAvisoPrevia}</p>
                      <p className="text-sm text-muted-foreground">
                        {((desligamentosData.comAvisoPrevia / desligamentosData.totalDesligamentos) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-orange-500/5 rounded-lg border border-orange-500/20">
                    <div>
                      <p className="font-semibold text-orange-500">Sem Aviso Prévio</p>
                      <p className="text-sm text-muted-foreground">Desligamentos imediatos</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-500">{desligamentosData.semAvisoPrevia}</p>
                      <p className="text-sm text-muted-foreground">
                        {((desligamentosData.semAvisoPrevia / desligamentosData.totalDesligamentos) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-purple-500" />
                  Indicadores de Rotatividade
                </CardTitle>
                <CardDescription>Métricas de turnover e retenção</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-purple-500/5 rounded-lg border border-purple-500/20">
                    <p className="text-3xl font-bold text-purple-500">12.3%</p>
                    <p className="text-sm text-muted-foreground">Taxa de Rotatividade Mensal</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-lg font-bold">87.7%</p>
                      <p className="text-xs text-muted-foreground">Taxa de Retenção</p>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-lg font-bold">2.1</p>
                      <p className="text-xs text-muted-foreground">Desligamentos/Semana</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Análise Gráfica de Desligamentos
              </CardTitle>
              <CardDescription>Visualização detalhada dos dados de desligamento</CardDescription>
            </CardHeader>
            <CardContent>
              <DesligamentosChart data={desligamentosData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="motivos" className="space-y-6">
          <MotivosAnalysis data={desligamentosData.motivosFrequentes} userRole={userRole} />
        </TabsContent>

        <TabsContent value="registros" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <UserMinus className="w-5 h-5" />
                  Registro de Desligamentos
                </span>
                {userRole === "admin" && (
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Desligamento
                  </Button>
                )}
              </CardTitle>
              <CardDescription>Controle detalhado de todos os desligamentos</CardDescription>
            </CardHeader>
            <CardContent>
              <DesligamentosTable userRole={userRole} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
