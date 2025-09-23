"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { QuadroChart } from "@/components/quadro-chart"
import { QuadroTable } from "@/components/quadro-table"
import { Building2, TrendingUp, Users, Calendar, Shield, Plus } from "lucide-react"

interface QuadroTabProps {
  userRole: "admin" | "user"
}

export function QuadroTab({ userRole }: QuadroTabProps) {
  const [selectedArea, setSelectedArea] = useState<"caixa" | "cobranca">("caixa")
  const [activeSubTab, setActiveSubTab] = useState("total")
  const [showDailyForm, setShowDailyForm] = useState(false)
  const [selectedTurno, setSelectedTurno] = useState<string>("geral")
  const [registros, setRegistros] = useState<any[]>([])

  // Mock data - em produção viria do backend
  const quadroData = {
    caixa: {
      total: 150,
      ativos: 120,
      ferias: 15,
      afastamento: 10,
      inss: 5,
    },
    cobranca: {
      total: 80,
      ativos: 65,
      ferias: 8,
      afastamento: 5,
      inss: 2,
    },
  }

  const currentData = quadroData[selectedArea]

  const statsCards = [
    {
      title: "Total",
      value: currentData.total,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Ativos",
      value: currentData.ativos,
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Férias",
      value: currentData.ferias,
      icon: Calendar,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Afastamento",
      value: currentData.afastamento,
      icon: Shield,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "INSS",
      value: currentData.inss,
      icon: Building2,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header com seleção de área e turno */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Quadro de Funcionários</h2>
          <p className="text-muted-foreground">Acompanhamento em tempo real do quadro de pessoal</p>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="area-select" className="text-sm font-medium">
            Área:
          </Label>
          <Select value={selectedArea} onValueChange={(value: "caixa" | "cobranca") => setSelectedArea(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="caixa">Caixa</SelectItem>
              <SelectItem value="cobranca">Cobrança</SelectItem>
            </SelectContent>
          </Select>
          <Label htmlFor="turno-select" className="text-sm font-medium ml-4">
            Turno:
          </Label>
          <Select value={selectedTurno} onValueChange={setSelectedTurno}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="geral">Geral</SelectItem>
              <SelectItem value="manha">Manhã</SelectItem>
              <SelectItem value="tarde">Tarde</SelectItem>
              <SelectItem value="integral">Integral</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cards de estatísticas + botão de preenchimento diário */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                {userRole === "admin" && (
                  <Button
                    size="sm"
                    className="mt-4 w-full"
                    variant="outline"
                    onClick={() => setShowDailyForm(true)}
                  >
                    Preencher Diário
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Formulário/tabela de preenchimento diário */}
      {showDailyForm && (
        <div className="my-6">
          <Card>
            <CardHeader>
              <CardTitle>Preenchimento Diário do Quadro</CardTitle>
              <CardDescription>Preencha os dados do dia para o quadro de pessoal</CardDescription>
            </CardHeader>
            <CardContent>
              <QuadroTable userRole={userRole} area={selectedArea} activeTab={activeSubTab} turno={selectedTurno} />
              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm" onClick={() => setShowDailyForm(false)}>
                  Fechar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs para detalhamento */}
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="total">Total</TabsTrigger>
          <TabsTrigger value="ativos">Ativos</TabsTrigger>
          <TabsTrigger value="ferias">Férias</TabsTrigger>
          <TabsTrigger value="afastamento">Afastamento</TabsTrigger>
          <TabsTrigger value="inss">INSS</TabsTrigger>
        </TabsList>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Análise - {selectedArea.charAt(0).toUpperCase() + selectedArea.slice(1)}
              </CardTitle>
              <CardDescription>Distribuição do quadro de funcionários</CardDescription>
            </CardHeader>
            <CardContent>
              <QuadroChart data={currentData} area={selectedArea} turno={selectedTurno} registros={registros} />
            </CardContent>
          </Card>

          {/* Tabela de entrada de dados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Registro Diário
                </span>
                {userRole === "admin" && (
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                )}
              </CardTitle>
              <CardDescription>Atualizações diárias do quadro</CardDescription>
            </CardHeader>
            <CardContent>
              <QuadroTable
                userRole={userRole}
                area={selectedArea}
                activeTab={activeSubTab}
                turno={selectedTurno}
                // Atualiza registros no estado local para o gráfico
                // O QuadroTable precisa ser ajustado para aceitar onChange
                onChangeRegistros={setRegistros}
              />
            </CardContent>
          </Card>
        </div>

        {/* Conteúdo específico de cada tab */}
        <TabsContent value="total" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Visão Geral - Total de Funcionários</CardTitle>
              <CardDescription>Resumo completo do quadro de {selectedArea}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-2xl font-bold text-green-500">{currentData.ativos}</p>
                  <p className="text-sm text-muted-foreground">Ativos</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-500">{currentData.ferias}</p>
                  <p className="text-sm text-muted-foreground">Férias</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-2xl font-bold text-orange-500">{currentData.afastamento}</p>
                  <p className="text-sm text-muted-foreground">Afastamento</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-2xl font-bold text-purple-500">{currentData.inss}</p>
                  <p className="text-sm text-muted-foreground">INSS</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ativos" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Funcionários Ativos</CardTitle>
              <CardDescription>Colaboradores em atividade normal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <p className="text-4xl font-bold text-green-500 mb-2">{currentData.ativos}</p>
                  <p className="text-muted-foreground">Funcionários ativos em {selectedArea}</p>
                  <Badge variant="outline" className="mt-2">
                    {((currentData.ativos / currentData.total) * 100).toFixed(1)}% do total
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ferias" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Funcionários em Férias</CardTitle>
              <CardDescription>Colaboradores em período de férias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <p className="text-4xl font-bold text-yellow-500 mb-2">{currentData.ferias}</p>
                  <p className="text-muted-foreground">Funcionários em férias</p>
                  <Badge variant="outline" className="mt-2">
                    {((currentData.ferias / currentData.total) * 100).toFixed(1)}% do total
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="afastamento" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Funcionários Afastados</CardTitle>
              <CardDescription>Colaboradores em afastamento médico ou outros</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <p className="text-4xl font-bold text-orange-500 mb-2">{currentData.afastamento}</p>
                  <p className="text-muted-foreground">Funcionários afastados</p>
                  <Badge variant="outline" className="mt-2">
                    {((currentData.afastamento / currentData.total) * 100).toFixed(1)}% do total
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inss" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Funcionários INSS</CardTitle>
              <CardDescription>Colaboradores em benefício do INSS</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <p className="text-4xl font-bold text-purple-500 mb-2">{currentData.inss}</p>
                  <p className="text-muted-foreground">Funcionários em INSS</p>
                  <Badge variant="outline" className="mt-2">
                    {((currentData.inss / currentData.total) * 100).toFixed(1)}% do total
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
