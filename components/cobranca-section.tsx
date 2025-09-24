"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Users, UserCheck, Plane, AlertCircle, BarChart3, Edit, Trash2 } from "lucide-react"
import { AddCobrancaDialog } from "@/components/add-cobranca-dialog"
import { CobrancaChart } from "@/components/cobranca-chart"
import { useAuth } from "@/lib/auth"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import type { Turno, EstatisticaCobranca, EstatisticaCobrancaGeral } from "@/lib/data"
import { mockEstatisticasCobranca, mockEstatisticasCobrancaGeral, carteirasDisponiveis } from "@/lib/data"

interface CobrancaSectionProps {
  selectedTurno: Turno
}

export function CobrancaSection({ selectedTurno }: CobrancaSectionProps) {
  const { user } = useAuth()
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showAddCarteiraDialog, setShowAddCarteiraDialog] = useState(false)
  const [showEditCarteiraDialog, setShowEditCarteiraDialog] = useState(false)
  const [editingCarteira, setEditingCarteira] = useState<string>("")
  const [editingCarteiraIndex, setEditingCarteiraIndex] = useState<number>(-1)
  const [carteiras, setCarteiras] = useState<string[]>(carteirasDisponiveis)
  const [estatisticasPorCarteira, setEstatisticasPorCarteira] =
    useState<EstatisticaCobranca[]>(mockEstatisticasCobranca)
  const [estatisticasGerais, setEstatisticasGerais] =
    useState<EstatisticaCobrancaGeral[]>(mockEstatisticasCobrancaGeral)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingRecord, setEditingRecord] = useState<EstatisticaCobranca | null>(null)

  const filteredCarteiras =
    selectedTurno === "geral"
      ? estatisticasPorCarteira
      : estatisticasPorCarteira.filter((item) => item.turno === selectedTurno)

  const filteredGerais =
    selectedTurno === "geral" ? estatisticasGerais : estatisticasGerais.filter((item) => item.turno === selectedTurno)

  const totalsPorCarteira = carteiras.map((carteira) => {
    const carteiraData = filteredCarteiras.filter((item) => item.carteira === carteira)
    return {
      carteira,
      total: carteiraData.reduce((acc, item) => acc + item.total, 0),
      presentes: carteiraData.reduce((acc, item) => acc + item.presentes, 0),
      faltas: carteiraData.reduce((acc, item) => acc + item.faltas, 0),
      abs: carteiraData.length > 0 ? carteiraData.reduce((acc, item) => acc + item.abs, 0) / carteiraData.length : 0,
    }
  })

  const totalsGerais = filteredGerais.reduce(
    (acc, item) => ({
      total: acc.total + item.total,
      ativos: acc.ativos + item.ativos,
      ferias: acc.ferias + item.ferias,
      afastamento: acc.afastamento + item.afastamento,
    }),
    { total: 0, ativos: 0, ferias: 0, afastamento: 0 },
  )

  const handleAddEstatistica = (novaEstatistica: Omit<EstatisticaCobranca, "id">) => {
    const newItem: EstatisticaCobranca = {
      ...novaEstatistica,
      id: Date.now().toString(),
    }
    setEstatisticasPorCarteira([...estatisticasPorCarteira, newItem])
  }

  const handleAddCarteira = (novaCarteira: string) => {
    if (!carteiras.includes(novaCarteira)) {
      setCarteiras([...carteiras, novaCarteira])
    }
  }

  const handleEditCarteira = (novoNome: string) => {
    const newCarteiras = [...carteiras]
    newCarteiras[editingCarteiraIndex] = novoNome.toUpperCase()
    setCarteiras(newCarteiras)
  }

  const handleDeleteCarteira = (carteira: string) => {
    setCarteiras((prev) => prev.filter((c) => c !== carteira))
    setEstatisticasPorCarteira((prev) => prev.filter((e) => e.carteira !== carteira))
  }

  const handleEditRecord = (updatedRecord: EstatisticaCobranca) => {
    setEstatisticasPorCarteira((prev) =>
      prev.map((record) => (record.id === updatedRecord.id ? updatedRecord : record)),
    )
  }

  const handleDeleteRecord = (id: string) => {
    setEstatisticasPorCarteira((prev) => prev.filter((record) => record.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Statistics by Carteira */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Estatísticas por Carteira</CardTitle>
              <CardDescription>Desempenho de cada carteira de cobrança</CardDescription>
            </div>
            {user?.role === "admin" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Gerenciar Carteiras
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setShowAddCarteiraDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Carteira
                  </DropdownMenuItem>
                  {carteiras.map((carteira, index) => (
                    <div key={carteira} className="flex items-center justify-between px-2 py-1">
                      <span className="text-sm">{carteira}</span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingCarteira(carteira)
                            setEditingCarteiraIndex(index)
                            setShowEditCarteiraDialog(true)
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteCarteira(carteira)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {totalsPorCarteira.map((carteira) => (
              <Card key={carteira.carteira} className="border-l-4 border-l-primary">
                <CardHeader className="pb-1">
                  <CardTitle className="text-xs font-medium">{carteira.carteira}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-medium">{carteira.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Presentes:</span>
                    <span className="font-medium text-green-600">{carteira.presentes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Faltas:</span>
                    <span className="font-medium text-red-600">{carteira.faltas}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ABS:</span>
                    <span className="font-medium text-orange-600">{carteira.abs.toFixed(1)}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* General Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Geral</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalsGerais.total}</div>
            <p className="text-xs text-muted-foreground">funcionários</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalsGerais.ativos}</div>
            <p className="text-xs text-muted-foreground">trabalhando</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Férias</CardTitle>
            <Plane className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalsGerais.ferias}</div>
            <p className="text-xs text-muted-foreground">em férias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Afastamento</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{totalsGerais.afastamento}</div>
            <p className="text-xs text-muted-foreground">afastados</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Análise de Desempenho por Carteira
          </CardTitle>
          <CardDescription>Comparativo detalhado de performance e produtividade</CardDescription>
        </CardHeader>
        <CardContent>
          <CobrancaChart data={filteredCarteiras} />
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Registros por Carteira</CardTitle>
            <CardDescription>
              Histórico detalhado {selectedTurno !== "geral" && `do turno ${selectedTurno}`}
            </CardDescription>
          </div>
          {user?.role === "admin" && (
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Registro
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Turno</TableHead>
                <TableHead>Carteira</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Presentes</TableHead>
                <TableHead>Faltas</TableHead>
                <TableHead>ABS (%)</TableHead>
                {user?.role === "admin" && <TableHead>Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCarteiras.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{new Date(item.data).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {item.turno}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.carteira}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{item.total}</TableCell>
                  <TableCell className="text-green-600">{item.presentes}</TableCell>
                  <TableCell className="text-red-600">{item.faltas}</TableCell>
                  <TableCell className="text-orange-600">{item.abs.toFixed(1)}%</TableCell>
                  {user?.role === "admin" && (
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingRecord(item)
                            setShowEditDialog(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteRecord(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Carteira Dialog */}
      <Dialog open={showAddCarteiraDialog} onOpenChange={setShowAddCarteiraDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Carteira</DialogTitle>
            <DialogDescription>Insira o nome da nova carteira de cobrança</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const novaCarteira = formData.get("carteira") as string
              if (novaCarteira.trim()) {
                handleAddCarteira(novaCarteira.trim().toUpperCase())
                setShowAddCarteiraDialog(false)
              }
            }}
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="carteira">Nome da Carteira</Label>
                <Input id="carteira" name="carteira" placeholder="Ex: NOVA CARTEIRA" required />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setShowAddCarteiraDialog(false)}>
                Cancelar
              </Button>
              <Button type="submit">Adicionar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Carteira Dialog */}
      <Dialog open={showEditCarteiraDialog} onOpenChange={setShowEditCarteiraDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Carteira</DialogTitle>
            <DialogDescription>Altere o nome da carteira</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const novoNome = formData.get("carteira") as string
              if (novoNome.trim()) {
                handleEditCarteira(novoNome.trim())
                setShowEditCarteiraDialog(false)
              }
            }}
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="carteira">Nome da Carteira</Label>
                <Input id="carteira" name="carteira" defaultValue={editingCarteira} required />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setShowEditCarteiraDialog(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <AddCobrancaDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAdd={handleAddEstatistica}
        carteirasDisponiveis={carteiras}
      />
    </div>
  )
}
