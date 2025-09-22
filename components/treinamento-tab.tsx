"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TreinamentoTable } from "@/components/treinamento-table"
import { CarteiraManager } from "@/components/carteira-manager"
import { TreinamentoChart } from "@/components/treinamento-chart"
import { GraduationCap, TrendingUp, Clock, CheckCircle, Plus, Building2 } from "lucide-react"

interface TreinamentoTabProps {
  userRole: "admin" | "user"
}

export function TreinamentoTab({ userRole }: TreinamentoTabProps) {
  const [carteiras, setCarteiras] = useState([
    { id: "1", nome: "CAIXA", total: 45, aplicados: 30, pendentes: 15 },
    { id: "2", nome: "BTG", total: 32, aplicados: 25, pendentes: 7 },
    { id: "3", nome: "WILLBANK", total: 28, aplicados: 20, pendentes: 8 },
    { id: "4", nome: "PEFISA", total: 22, aplicados: 18, pendentes: 4 },
    { id: "5", nome: "SANTANDER", total: 35, aplicados: 28, pendentes: 7 },
  ])

  const [showCarteiraManager, setShowCarteiraManager] = useState(false)

  // Cálculos das estatísticas gerais
  const totalTreinamentos = carteiras.reduce((acc, carteira) => acc + carteira.total, 0)
  const totalAplicados = carteiras.reduce((acc, carteira) => acc + carteira.aplicados, 0)
  const totalPendentes = carteiras.reduce((acc, carteira) => acc + carteira.pendentes, 0)

  const statsData = {
    total: totalTreinamentos,
    aplicados: totalAplicados,
    pendentes: totalPendentes,
    percentualAplicados: totalTreinamentos > 0 ? (totalAplicados / totalTreinamentos) * 100 : 0,
  }

  const handleAddCarteira = (nome: string) => {
    const novaCarteira = {
      id: Date.now().toString(),
      nome: nome.toUpperCase(),
      total: 0,
      aplicados: 0,
      pendentes: 0,
    }
    setCarteiras([...carteiras, novaCarteira])
  }

  const handleRemoveCarteira = (id: string) => {
    setCarteiras(carteiras.filter((c) => c.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Sistema de Treinamento</h2>
          <p className="text-muted-foreground">Acompanhamento e controle de treinamentos por carteira</p>
        </div>
        {userRole === "admin" && (
          <Button onClick={() => setShowCarteiraManager(!showCarteiraManager)}>
            <Building2 className="w-4 h-4 mr-2" />
            Gerenciar Carteiras
          </Button>
        )}
      </div>

      {/* Gerenciador de Carteiras */}
      {showCarteiraManager && userRole === "admin" && (
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle>Gerenciar Carteiras</CardTitle>
            <CardDescription>Adicione ou remova carteiras do sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <CarteiraManager
              carteiras={carteiras}
              onAddCarteira={handleAddCarteira}
              onRemoveCarteira={handleRemoveCarteira}
              onClose={() => setShowCarteiraManager(false)}
            />
          </CardContent>
        </Card>
      )}

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Treinamentos</p>
                <p className="text-2xl font-bold">{statsData.total}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aplicados</p>
                <p className="text-2xl font-bold text-green-500">{statsData.aplicados}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-500">{statsData.pendentes}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa de Conclusão</p>
                <p className="text-2xl font-bold text-purple-500">{statsData.percentualAplicados.toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas por Carteira */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Estatísticas por Carteira
          </CardTitle>
          <CardDescription>Desempenho de treinamentos por carteira</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {carteiras.map((carteira) => (
              <div key={carteira.id} className="p-4 border border-border rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{carteira.nome}</h3>
                  <Badge variant="outline">{carteira.total} total</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Aplicados:</span>
                    <span className="font-medium text-green-500">{carteira.aplicados}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pendentes:</span>
                    <span className="font-medium text-yellow-500">{carteira.pendentes}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{
                        width: carteira.total > 0 ? `${(carteira.aplicados / carteira.total) * 100}%` : "0%",
                      }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground text-center">
                    {carteira.total > 0 ? ((carteira.aplicados / carteira.total) * 100).toFixed(1) : 0}% concluído
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
              Análise de Treinamentos
            </CardTitle>
            <CardDescription>Distribuição e progresso dos treinamentos</CardDescription>
          </CardHeader>
          <CardContent>
            <TreinamentoChart data={carteiras} />
          </CardContent>
        </Card>

        {/* Tabela de Treinamentos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Registro de Treinamentos
              </span>
              {userRole === "admin" && (
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              )}
            </CardTitle>
            <CardDescription>Controle de treinamentos aplicados e pendentes</CardDescription>
          </CardHeader>
          <CardContent>
            <TreinamentoTable userRole={userRole} carteiras={carteiras} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
