"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, UserCheck, GraduationCap, Calendar, Search, BarChart3 } from "lucide-react"
import { AddTreinadoDialog } from "@/components/add-treinado-dialog"
import { TreinadosChart } from "@/components/treinados-chart"
import { useAuth } from "@/lib/auth"
import type { OperadorTreinado, Carteira } from "@/lib/data"
import { mockOperadoresTreinados, carteirasDisponiveis } from "@/lib/data"

export function TreinadosTab() {
  const { user } = useAuth()
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [operadoresTreinados, setOperadoresTreinados] = useState<OperadorTreinado[]>(mockOperadoresTreinados)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCarteira, setFilterCarteira] = useState<Carteira | "all">("all")

  // Filter data
  const filteredOperadores = operadoresTreinados.filter((operador) => {
    const matchesSearch =
      operador.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      operador.assunto.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCarteira = filterCarteira === "all" || operador.carteira === filterCarteira
    return matchesSearch && matchesCarteira
  })

  // Calculate statistics
  const totalTreinados = operadoresTreinados.length
  const treinadosPorCarteira = carteirasDisponiveis.map((carteira) => {
    const count = operadoresTreinados.filter((op) => op.carteira === carteira).length
    return { carteira, count }
  })

  const treinadosPorAssunto = operadoresTreinados.reduce(
    (acc, operador) => {
      acc[operador.assunto] = (acc[operador.assunto] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const handleAddTreinado = (novoTreinado: Omit<OperadorTreinado, "id">) => {
    const newOperador: OperadorTreinado = {
      ...novoTreinado,
      id: Date.now().toString(),
    }
    setOperadoresTreinados([...operadoresTreinados, newOperador])
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Operadores Treinados</h2>
          <p className="text-muted-foreground">Visualize operadores que concluíram treinamentos</p>
        </div>
        {user?.role === "admin" && (
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Treinado
          </Button>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Treinados</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTreinados}</div>
            <p className="text-xs text-muted-foreground">operadores certificados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {
                operadoresTreinados.filter((op) => new Date(op.dataConclusao).getMonth() === new Date().getMonth())
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground">novos treinados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mais Treinada</CardTitle>
            <GraduationCap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {treinadosPorCarteira.reduce((max, current) => (current.count > max.count ? current : max)).carteira}
            </div>
            <p className="text-xs text-muted-foreground">carteira líder</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assunto Popular</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {
                Object.entries(treinadosPorAssunto)
                  .reduce((max, [assunto, count]) => (count > max.count ? { assunto, count } : max), {
                    assunto: "",
                    count: 0,
                  })
                  .assunto.split(" ")[0]
              }
            </div>
            <p className="text-xs text-muted-foreground">mais solicitado</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Treinados por Carteira
          </CardTitle>
          <CardDescription>Distribuição de operadores treinados por carteira</CardDescription>
        </CardHeader>
        <CardContent>
          <TreinadosChart data={operadoresTreinados} />
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Operadores Treinados</CardTitle>
          <CardDescription>Lista completa de operadores que concluíram treinamentos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou assunto..."
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
                <TableHead>Assunto</TableHead>
                <TableHead>Data Início</TableHead>
                <TableHead>Data Conclusão</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Observação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOperadores.map((operador) => (
                <TableRow key={operador.id}>
                  <TableCell className="font-medium">{operador.nome}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{operador.carteira}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {operador.turno}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-32 truncate" title={operador.assunto}>
                    {operador.assunto}
                  </TableCell>
                  <TableCell>{new Date(operador.dataInicio).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>{new Date(operador.dataConclusao).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>{operador.responsavel}</TableCell>
                  <TableCell className="max-w-48 truncate" title={operador.observacao}>
                    {operador.observacao}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <AddTreinadoDialog open={showAddDialog} onOpenChange={setShowAddDialog} onAdd={handleAddTreinado} />
    </div>
  )
}
