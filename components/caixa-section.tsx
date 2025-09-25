"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Users, UserCheck, Plane, AlertCircle, BarChart3, Settings, Edit, Trash2 } from "lucide-react"
import { AddCaixaDialog } from "@/components/add-caixa-dialog"
import { CaixaChart } from "@/components/caixa-chart"
import { useAuth } from "@/lib/auth"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { Turno, EstatisticaCaixa } from "@/lib/data"
import { mockEstatisticasCaixa, adicionarEstatistica } from "@/lib/data"

interface CaixaSectionProps {
  selectedTurno: Turno
}

interface TipoEstatistica {
  id: string
  nome: string
  cor: string
  icone: string
}

const estatisticasDefault: TipoEstatistica[] = [
  { id: "total", nome: "Total", cor: "text-foreground", icone: "Users" },
  { id: "ativos", nome: "Ativos", cor: "text-green-600", icone: "UserCheck" },
  { id: "ferias", nome: "Férias", cor: "text-blue-600", icone: "Plane" },
  { id: "afastamento", nome: "Afastamento", cor: "text-orange-600", icone: "AlertCircle" },
]

export function CaixaSection({ selectedTurno }: CaixaSectionProps) {
  const { user } = useAuth()
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showAddEstatisticaDialog, setShowAddEstatisticaDialog] = useState(false)
  const [showEditEstatisticaDialog, setShowEditEstatisticaDialog] = useState(false)
  const [editingEstatistica, setEditingEstatistica] = useState<TipoEstatistica | null>(null)
  const [tiposEstatisticas, setTiposEstatisticas] = useState<TipoEstatistica[]>(estatisticasDefault)
  const [estatisticas, setEstatisticas] = useState<EstatisticaCaixa[]>(mockEstatisticasCaixa)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingRecord, setEditingRecord] = useState<EstatisticaCaixa | null>(null)

  const filteredData =
    selectedTurno === "geral" ? estatisticas : estatisticas.filter((item) => item.turno === selectedTurno)

  const totals = filteredData.reduce(
    (acc, item) => ({
      total: acc.total + item.total,
      ativos: acc.ativos + item.ativos,
      ferias: acc.ferias + item.ferias,
      afastamento: acc.afastamento + item.afastamento,
    }),
    { total: 0, ativos: 0, ferias: 0, afastamento: 0 },
  )

  const handleAddEstatistica = (novaEstatistica: Omit<EstatisticaCaixa, "id">) => {
    const newItem: EstatisticaCaixa = {
      ...novaEstatistica,
      id: Date.now().toString(),
    }
    setEstatisticas([...estatisticas, newItem])
  }

  const handleAddTipoEstatistica = (novoTipo: string) => {
    const cores = ["text-purple-600", "text-indigo-600", "text-pink-600", "text-teal-600", "text-yellow-600"]
    const corAleatoria = cores[Math.floor(Math.random() * cores.length)]

    const novaEstatistica: TipoEstatistica = {
      id: novoTipo.toLowerCase().replace(/\s+/g, "_"),
      nome: novoTipo,
      cor: corAleatoria,
      icone: "BarChart3",
    }

    setTiposEstatisticas([...tiposEstatisticas, novaEstatistica])
    adicionarEstatistica(novoTipo)
  }

  const handleEditTipoEstatistica = (id: string, novoNome: string) => {
    setTiposEstatisticas((prev) => prev.map((tipo) => (tipo.id === id ? { ...tipo, nome: novoNome } : tipo)))
  }

  const handleDeleteTipoEstatistica = (id: string) => {
    if (["total", "ativos", "ferias", "afastamento"].includes(id)) {
      alert("Não é possível excluir estatísticas padrão do sistema")
      return
    }
    setTiposEstatisticas((prev) => prev.filter((tipo) => tipo.id !== id))
    setEstatisticas((prev) => prev.filter((record) => record.tipo !== id))
  }

  const handleEditRecord = (updatedRecord: EstatisticaCaixa) => {
    setEstatisticas((prev) => prev.map((record) => (record.id === updatedRecord.id ? updatedRecord : record)))
  }

  const handleDeleteRecord = (id: string) => {
    setEstatisticas((prev) => prev.filter((record) => record.id !== id))
  }

  const getIcon = (iconeName: string) => {
    const icons = {
      Users,
      UserCheck,
      Plane,
      AlertCircle,
      BarChart3,
    }
    const IconComponent = icons[iconeName as keyof typeof icons] || BarChart3
    return <IconComponent className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Estatísticas do Quadro</h3>
          {user?.role === "admin" && (
            <Button variant="outline" size="sm" onClick={() => setShowAddEstatisticaDialog(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Gerenciar Estatísticas
            </Button>
          )}
      {/* Gerenciar Estatísticas Dialog */}
      <Dialog open={showAddEstatisticaDialog} onOpenChange={setShowAddEstatisticaDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerenciar Estatísticas</DialogTitle>
            <DialogDescription>Adicione, edite ou exclua estatísticas do quadro</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const novoTipo = formData.get("nome") as string
                if (novoTipo.trim()) {
                  handleAddTipoEstatistica(novoTipo.trim())
                  setTimeout(() => {
                    const input = document.getElementById("nome") as HTMLInputElement
                    if (input) input.value = ""
                  }, 0)
                }
              }}
            >
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Label htmlFor="nome">Nova Estatística</Label>
                  <Input id="nome" name="nome" placeholder="Ex: Licença Médica" required />
                </div>
                <Button type="submit" variant="default">
                  <Plus className="h-4 w-4 mr-1" /> Adicionar
                </Button>
              </div>
            </form>
            <div className="border-t my-2" />
            <ul className="space-y-2">
              {tiposEstatisticas.filter((tipo) => !["total", "ativos", "ferias", "afastamento"].includes(tipo.id)).length === 0 && (
                <li className="text-muted-foreground text-sm">Nenhuma estatística personalizada cadastrada.</li>
              )}
              {tiposEstatisticas
                .filter((tipo) => !["total", "ativos", "ferias", "afastamento"].includes(tipo.id))
                .map((tipo) => (
                  <li key={tipo.id} className="flex items-center justify-between bg-background rounded px-3 py-2">
                    <span className="text-sm max-w-40 truncate">{tipo.nome}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingEstatistica(tipo)
                          setShowEditEstatisticaDialog(true)
                        }}
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTipoEstatistica(tipo.id)}
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {tiposEstatisticas.map((tipo) => (
            <Card key={tipo.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{tipo.nome}</CardTitle>
                <div className={tipo.cor}>{getIcon(tipo.icone)}</div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${tipo.cor}`}>{totals[tipo.id as keyof typeof totals] || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {tipo.id === "total"
                    ? "funcionários"
                    : tipo.id === "ativos"
                      ? "trabalhando"
                      : tipo.id === "ferias"
                        ? "em férias"
                        : tipo.id === "afastamento"
                          ? "afastados"
                          : "registros"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Análise por Período
          </CardTitle>
          <CardDescription>Evolução do quadro de funcionários da Caixa</CardDescription>
        </CardHeader>
        <CardContent>
          <CaixaChart data={filteredData} />
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Registros Diários</CardTitle>
            <CardDescription>
              Histórico de registros {selectedTurno !== "geral" && `do turno ${selectedTurno}`}
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
                <TableHead>Total</TableHead>
                <TableHead>Ativos</TableHead>
                <TableHead>Férias</TableHead>
                <TableHead>Afastamento</TableHead>
                {user?.role === "admin" && <TableHead>Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{new Date(item.data).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {item.turno}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{item.total}</TableCell>
                  <TableCell className="text-green-600">{item.ativos}</TableCell>
                  <TableCell className="text-blue-600">{item.ferias}</TableCell>
                  <TableCell className="text-orange-600">{item.afastamento}</TableCell>
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

      {/* Add Dialog */}
      <AddCaixaDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAdd={handleAddEstatistica}
        tiposEstatisticas={tiposEstatisticas}
      />

      {/* Edit Estatística Dialog */}
      <Dialog open={showEditEstatisticaDialog} onOpenChange={setShowEditEstatisticaDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Estatística</DialogTitle>
            <DialogDescription>Altere o nome da estatística</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const novoNome = formData.get("nome") as string
              if (novoNome.trim() && editingEstatistica) {
                handleEditTipoEstatistica(editingEstatistica.id, novoNome.trim())
                setShowEditEstatisticaDialog(false)
                setEditingEstatistica(null)
              }
            }}
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome da Estatística</Label>
                <Input id="nome" name="nome" defaultValue={editingEstatistica?.nome} required />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setShowEditEstatisticaDialog(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Registro Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Registro</DialogTitle>
            <DialogDescription>Altere os dados do registro</DialogDescription>
          </DialogHeader>
          {editingRecord && (
            <AddCaixaDialog
              open={showEditDialog}
              onOpenChange={setShowEditDialog}
              onAdd={(data) => {
                handleEditRecord({ ...data, id: editingRecord.id })
              }}
              tiposEstatisticas={tiposEstatisticas}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
