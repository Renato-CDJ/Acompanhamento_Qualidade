"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, UserX, AlertTriangle, CheckCircle, TrendingDown, BarChart3, Search } from "lucide-react"
import { AddDesligamentoDialog } from "@/components/add-desligamento-dialog"
import { DesligamentosChart } from "@/components/desligamentos-chart"
import { useAuth } from "@/lib/auth"
import type { DesligamentoRecord, Carteira, EstatisticaDesligamento } from "@/lib/data"
import { mockDesligamentos, carteirasDisponiveis } from "@/lib/data"

export function DesligamentosTab() {
  const { user } = useAuth()
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [desligamentos, setDesligamentos] = useState<DesligamentoRecord[]>(mockDesligamentos)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCarteira, setFilterCarteira] = useState<Carteira | "all">("all")

  // Filter data
  const filteredDesligamentos = desligamentos.filter((desligamento) => {
    const matchesSearch =
      desligamento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      desligamento.motivo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCarteira = filterCarteira === "all" || desligamento.carteira === filterCarteira
    return matchesSearch && matchesCarteira
  })

  // Calculate statistics
  const estatisticas: EstatisticaDesligamento = {
    totalDesligamentos: desligamentos.length,
    comAvisoPrevio: desligamentos.filter((d) => d.avisoPrevio).length,
    semAvisoPrevio: desligamentos.filter((d) => !d.avisoPrevio).length,
    taxaRotatividade: 0, // This would be calculated based on total employees
  }

  // Assume 200 total employees for calculation
  const totalFuncionarios = 200
  estatisticas.taxaRotatividade = (estatisticas.totalDesligamentos / totalFuncionarios) * 100

  // Statistics by carteira
  const desligamentosPorCarteira = carteirasDisponiveis.map((carteira) => {
    const carteiraDesligamentos = desligamentos.filter((d) => d.carteira === carteira)
    return {
      carteira,
      total: carteiraDesligamentos.length,
      comAviso: carteiraDesligamentos.filter((d) => d.avisoPrevio).length,
      semAviso: carteiraDesligamentos.filter((d) => !d.avisoPrevio).length,
    }
  })

  // Statistics by motivo
  const motivosStats = desligamentos.reduce(
    (acc, desligamento) => {
      acc[desligamento.motivo] = (acc[desligamento.motivo] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const handleAddDesligamento = (novoDesligamento: Omit<DesligamentoRecord, "id">) => {
    const newDesligamento: DesligamentoRecord = {
      ...novoDesligamento,
      id: Date.now().toString(),
    }
    setDesligamentos([...desligamentos, newDesligamento])
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Controle de Desligamentos</h2>
          <p className="text-muted-foreground">Análise de desligamentos e rotatividade</p>
        </div>
        {user?.role === "admin" && (
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Registrar Desligamento
          </Button>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Desligamentos</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.totalDesligamentos}</div>
            <p className="text-xs text-muted-foreground">registros</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Aviso Prévio</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{estatisticas.comAvisoPrevio}</div>
            <p className="text-xs text-muted-foreground">
              {((estatisticas.comAvisoPrevio / estatisticas.totalDesligamentos) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sem Aviso Prévio</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{estatisticas.semAvisoPrevio}</div>
            <p className="text-xs text-muted-foreground">
              {((estatisticas.semAvisoPrevio / estatisticas.totalDesligamentos) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Rotatividade</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{estatisticas.taxaRotatividade.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">do quadro total</p>
          </CardContent>
        </Card>
      </div>

      {/* Statistics by Carteira */}
      <Card>
        <CardHeader>
          <CardTitle>Desligamentos por Carteira</CardTitle>
          <CardDescription>Análise de desligamentos por carteira de trabalho</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {desligamentosPorCarteira.map((carteira) => (
              <Card key={carteira.carteira} className="border-l-4 border-l-destructive">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{carteira.carteira}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total:</span>
                    <span className="font-medium">{carteira.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Com Aviso:</span>
                    <span className="font-medium text-green-600">{carteira.comAviso}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Sem Aviso:</span>
                    <span className="font-medium text-red-600">{carteira.semAviso}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Análise de Motivos de Desligamento
          </CardTitle>
          <CardDescription>Distribuição dos motivos de desligamento</CardDescription>
        </CardHeader>
        <CardContent>
          <DesligamentosChart data={desligamentos} />
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registros de Desligamento</CardTitle>
          <CardDescription>Histórico completo de desligamentos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou motivo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={filterCarteira} onValueChange={(value: Carteira | "all") => setFilterCarteira(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Carteiras</SelectItem>
                {carteirasDisponiveis.map((carteira) => (
                  <SelectItem key={carteira} value={carteira}>
                    {carteira}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Carteira</TableHead>
                <TableHead>Turno</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Aviso Prévio</TableHead>
                <TableHead>Veio de Agência</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Observação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDesligamentos.map((desligamento) => (
                <TableRow key={desligamento.id}>
                  <TableCell className="font-medium">{desligamento.nome}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{desligamento.carteira}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {desligamento.turno}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(desligamento.data).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell className="max-w-32 truncate" title={desligamento.motivo}>
                    {desligamento.motivo}
                  </TableCell>
                  <TableCell>
                    <Badge variant={desligamento.avisoPrevio ? "default" : "destructive"}>
                      {desligamento.avisoPrevio ? "Sim" : "Não"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={desligamento.veioDeAgencia ? "secondary" : "outline"}>
                      {desligamento.veioDeAgencia ? "Sim" : "Não"}
                    </Badge>
                  </TableCell>
                  <TableCell>{desligamento.responsavel}</TableCell>
                  <TableCell className="max-w-48 truncate" title={desligamento.observacao}>
                    {desligamento.observacao}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <AddDesligamentoDialog open={showAddDialog} onOpenChange={setShowAddDialog} onAdd={handleAddDesligamento} />
    </div>
  )
}
