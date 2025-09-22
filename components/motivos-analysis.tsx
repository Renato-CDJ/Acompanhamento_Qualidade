"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, TrendingUp, Plus, Eye } from "lucide-react"

interface MotivoData {
  motivo: string
  quantidade: number
  percentual: number
}

interface MotivosAnalysisProps {
  data: MotivoData[]
  userRole: "admin" | "user"
}

export function MotivosAnalysis({ data, userRole }: MotivosAnalysisProps) {
  const [showDetails, setShowDetails] = useState<string | null>(null)

  const getMotivoPriority = (percentual: number) => {
    if (percentual >= 20) return { color: "text-red-500", bg: "bg-red-500/10", label: "Alto Risco" }
    if (percentual >= 15) return { color: "text-orange-500", bg: "bg-orange-500/10", label: "Atenção" }
    return { color: "text-yellow-500", bg: "bg-yellow-500/10", label: "Monitorar" }
  }

  const getActionRecommendation = (motivo: string) => {
    const recommendations: Record<string, string[]> = {
      "Inadequação ao cargo": [
        "Revisar processo de seleção",
        "Melhorar descrição de cargos",
        "Implementar período de experiência mais estruturado",
      ],
      "Problemas de performance": [
        "Criar plano de desenvolvimento individual",
        "Implementar feedback contínuo",
        "Revisar metas e objetivos",
      ],
      "Questões disciplinares": [
        "Reforçar treinamento sobre políticas",
        "Melhorar comunicação de regras",
        "Implementar programa de mentoria",
      ],
      "Pedido de demissão": [
        "Realizar pesquisa de clima organizacional",
        "Revisar política de benefícios",
        "Implementar programa de retenção",
      ],
    }
    return recommendations[motivo] || ["Analisar casos específicos", "Implementar ações preventivas"]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold">Análise de Motivos de Desligamento</h3>
          <p className="text-muted-foreground">Identificação de padrões e oportunidades de melhoria</p>
        </div>
        {userRole === "admin" && (
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Motivo
          </Button>
        )}
      </div>

      {/* Lista de Motivos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {data.map((item, index) => {
          const priority = getMotivoPriority(item.percentual)
          const isExpanded = showDetails === item.motivo

          return (
            <Card key={item.motivo} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{item.motivo}</CardTitle>
                  <Badge className={`${priority.color} ${priority.bg}`}>{priority.label}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Ocorrências</span>
                  <span className="font-semibold">{item.quantidade} casos</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Percentual</span>
                    <span className="font-semibold">{item.percentual.toFixed(1)}%</span>
                  </div>
                  <Progress value={item.percentual} className="h-2" />
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowDetails(isExpanded ? null : item.motivo)}>
                    <Eye className="w-3 h-3 mr-1" />
                    {isExpanded ? "Ocultar" : "Ver"} Detalhes
                  </Button>
                  {item.percentual >= 15 && (
                    <Badge variant="outline" className="text-orange-500 border-orange-500/50">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Requer Ação
                    </Badge>
                  )}
                </div>

                {isExpanded && (
                  <div className="mt-4 p-4 bg-muted/30 rounded-lg animate-slide-up">
                    <h4 className="font-semibold mb-2">Recomendações de Ação:</h4>
                    <ul className="space-y-1">
                      {getActionRecommendation(item.motivo).map((recommendation, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                          {recommendation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Resumo de Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Insights e Tendências
          </CardTitle>
          <CardDescription>Análise dos principais padrões identificados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Principais Preocupações:</h4>
              <div className="space-y-2">
                {data
                  .filter((item) => item.percentual >= 15)
                  .map((item) => (
                    <div
                      key={item.motivo}
                      className="flex items-center justify-between p-3 bg-red-500/5 rounded-lg border border-red-500/20"
                    >
                      <span className="text-sm font-medium">{item.motivo}</span>
                      <Badge variant="outline" className="text-red-500 border-red-500/50">
                        {item.percentual.toFixed(1)}%
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Oportunidades de Melhoria:</h4>
              <div className="space-y-3">
                <div className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                  <p className="text-sm font-medium text-blue-500">Processo de Seleção</p>
                  <p className="text-xs text-muted-foreground">
                    {(data.find((d) => d.motivo === "Inadequação ao cargo")?.percentual || 0).toFixed(1)}% dos
                    desligamentos por inadequação
                  </p>
                </div>
                <div className="p-3 bg-green-500/5 rounded-lg border border-green-500/20">
                  <p className="text-sm font-medium text-green-500">Gestão de Performance</p>
                  <p className="text-xs text-muted-foreground">
                    {(data.find((d) => d.motivo === "Problemas de performance")?.percentual || 0).toFixed(1)}% por
                    questões de desempenho
                  </p>
                </div>
                <div className="p-3 bg-purple-500/5 rounded-lg border border-purple-500/20">
                  <p className="text-sm font-medium text-purple-500">Retenção de Talentos</p>
                  <p className="text-xs text-muted-foreground">
                    {(data.find((d) => d.motivo === "Pedido de demissão")?.percentual || 0).toFixed(1)}% por pedido de
                    demissão
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
