"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, GraduationCap, CheckCircle, Clock, TrendingUp, BarChart3, Edit, Trash2 } from "lucide-react"
import { AddCapacitacaoDialog } from "@/components/add-capacitacao-dialog"
import { CapacitacaoChart } from "@/components/capacitacao-chart"
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { CapacitacaoRecord, EstatisticaCapacitacao } from "@/lib/data"
import { mockCapacitacaoRecords, carteirasDisponiveis, assuntosCapacitacao, adicionarAssuntoCapacitacao } from "@/lib/data"

export function CapacitacaoTab() {
  const { user } = useAuth()
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showAddAssuntoDialog, setShowAddAssuntoDialog] = useState(false)
  const [showEditAssuntoDialog, setShowEditAssuntoDialog] = useState(false)
  const [editingAssunto, setEditingAssunto] = useState<string>("")
  const [editingAssuntoIndex, setEditingAssuntoIndex] = useState<number>(-1)
  const [capacitacaoRecords, setCapacitacaoRecords] = useState<CapacitacaoRecord[]>(mockCapacitacaoRecords)
  const [assuntos, setAssuntos] = useState<string[]>(assuntosCapacitacao)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingRecord, setEditingRecord] = useState<CapacitacaoRecord | null>(null)

  // Calculate general statistics
  const estatisticasGerais: EstatisticaCapacitacao = {
    totalTreinamentos: capacitacaoRecords.reduce((acc, record) => acc + record.quantidade, 0),
    aplicados: capacitacaoRecords
      .filter((record) => record.status === "aplicado")
      .reduce((acc, record) => acc + record.quantidade, 0),
    pendentes: capacitacaoRecords
      .filter((record) => record.status === "pendente")
      .reduce((acc, record) => acc + record.quantidade, 0),
    taxaConclusao: 0,
  }

  estatisticasGerais.taxaConclusao =
    estatisticasGerais.totalTreinamentos > 0
      ? (estatisticasGerais.aplicados / estatisticasGerais.totalTreinamentos) * 100
      : 0

  // Calculate statistics by carteira
  const estatisticasPorCarteira = carteirasDisponiveis.map((carteira) => {
    const carteiraRecords = capacitacaoRecords.filter((record) => record.carteira === carteira)
    const total = carteiraRecords.reduce((acc, record) => acc + record.quantidade, 0)
    const aplicados = carteiraRecords
      .filter((record) => record.status === "aplicado")
      .reduce((acc, record) => acc + record.quantidade, 0)
    const pendentes = carteiraRecords
      .filter((record) => record.status === "pendente")
      .reduce((acc, record) => acc + record.quantidade, 0)

    return {
      carteira,
      total,
      aplicados,
      pendentes,
      taxaConclusao: total > 0 ? (aplicados / total) * 100 : 0,
    }
  })

  const handleAddCapacitacao = (novaCapacitacao: Omit<CapacitacaoRecord, "id">) => {
    const newRecord: CapacitacaoRecord = {
      ...novaCapacitacao,
      id: Date.now().toString(),
    }
    setCapacitacaoRecords([...capacitacaoRecords, newRecord])
  }

  const handleAddAssunto = (novoAssunto: string) => {
    if (!assuntos.includes(novoAssunto)) {
      setAssuntos([...assuntos, novoAssunto])
      adicionarAssuntoCapacitacao(novoAssunto)
    }
  }

  const handleEditAssunto = (novoNome: string) => {
    const newAssuntos = [...assuntos]
    newAssuntos[editingAssuntoIndex] = novoNome
    setAssuntos(newAssuntos)
  }

  const handleDeleteAssunto = (assunto: string) => {
    setAssuntos((prev) => prev.filter((a) => a !== assunto))
    // Remove registros do assunto excluído
    setCapacitacaoRecords((prev) => prev.filter((r) => r.assunto !== assunto))
  }

  const handleEditRecord = (updatedRecord: CapacitacaoRecord) => {
    setCapacitacaoRecords((prev) => prev.map((record) => (record.id === updatedRecord.id ? updatedRecord : record)))
  }

  const handleDeleteRecord = (id: string) => {
    setCapacitacaoRecords((prev) => prev.filter((record) => record.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Capacitação e Treinamentos</h2>
          <p className="text-muted-foreground">Controle de treinamentos e capacitações por carteira</p>
        </div>
        <div className="flex gap-2">
          {user?.role === "admin" && (
            <div className="mb-4 flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Gerenciar Assuntos
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-[260px]">
                  <DropdownMenuItem onClick={() => setShowAddAssuntoDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Assunto
                  </DropdownMenuItem>
                  <div className="border-t my-2" />
                  {assuntos.length === 0 && (
                    <div className="px-2 py-1 text-muted-foreground text-sm">Nenhum assunto cadastrado.</div>
                  )}
                  {assuntos.map((assunto, index) => (
                    <div key={assunto} className="flex items-center justify-between px-2 py-1">
                      <span className="text-sm max-w-[140px] truncate">{assunto}</span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingAssunto(assunto)
                            setEditingAssuntoIndex(index)
                            setShowEditAssuntoDialog(true)
                          }}
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAssunto(assunto)}
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Treinamento
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* General Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Treinamentos</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticasGerais.totalTreinamentos}</div>
            <p className="text-xs text-muted-foreground">pessoas treinadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aplicados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{estatisticasGerais.aplicados}</div>
            <p className="text-xs text-muted-foreground">concluídos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{estatisticasGerais.pendentes}</div>
            <p className="text-xs text-muted-foreground">aguardando</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{estatisticasGerais.taxaConclusao.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">efetividade</p>
          </CardContent>
        </Card>
      </div>

      {/* Statistics by Carteira */}
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas por Carteira</CardTitle>
          <CardDescription>Desempenho de treinamentos por carteira</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {estatisticasPorCarteira.map((carteira) => (
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
                    <span className="text-muted-foreground">Aplicados:</span>
                    <span className="font-medium text-green-600">{carteira.aplicados}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pendentes:</span>
                    <span className="font-medium text-orange-600">{carteira.pendentes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxa:</span>
                    <span className="font-medium text-blue-600">{carteira.taxaConclusao.toFixed(1)}%</span>
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
            Análise de Capacitação por Carteira
          </CardTitle>
          <CardDescription>Análise detalhada de eficiência e performance dos treinamentos</CardDescription>
        </CardHeader>
        <CardContent>
          <CapacitacaoChart data={capacitacaoRecords} />
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registros de Capacitação</CardTitle>
          <CardDescription>Histórico completo de treinamentos e capacitações</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Turno</TableHead>
                <TableHead>Carteira</TableHead>
                <TableHead>Assunto</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Responsável</TableHead>
                {user?.role === "admin" && <TableHead>Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {capacitacaoRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{new Date(record.data).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell className="font-medium">{record.quantidade}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {record.turno}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{record.carteira}</Badge>
                  </TableCell>
                  <TableCell className="max-w-32 truncate" title={record.assunto}>
                    {record.assunto}
                  </TableCell>
                  <TableCell>
                    <Badge variant={record.status === "aplicado" ? "default" : "destructive"}>
                      {record.status === "aplicado" ? "Aplicado" : "Pendente"}
                    </Badge>
                  </TableCell>
                  <TableCell>{record.responsavel}</TableCell>
                  {user?.role === "admin" && (
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingRecord(record)
                            setShowEditDialog(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteRecord(record.id)}>
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

      {/* Edit Assunto Dialog - renderizado fora do DropdownMenu */}
      {showEditAssuntoDialog && (
        <Dialog open={showEditAssuntoDialog} onOpenChange={setShowEditAssuntoDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Assunto</DialogTitle>
              <DialogDescription>Edite ou exclua as informações do assunto selecionado</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const novoNome = formData.get("assunto") as string
                if (novoNome.trim()) {
                  handleEditAssunto(novoNome.trim())
                  setShowEditAssuntoDialog(false)
                }
              }}
            >
              <div className="space-y-4">
                <Label htmlFor="editar-assunto">Nome do Assunto</Label>
                <Input id="editar-assunto" name="assunto" defaultValue={editingAssunto} required />
              </div>
              <DialogFooter className="mt-4">
                <Button type="button" variant="outline" onClick={() => setShowEditAssuntoDialog(false)}>
                  Cancelar
                </Button>
                <Button type="button" variant="destructive" onClick={() => { handleDeleteAssunto(editingAssunto); setShowEditAssuntoDialog(false); }}>
                  Excluir
                </Button>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
      {/* Edit Dialog para registro de capacitação */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Registro de Capacitação</DialogTitle>
            <DialogDescription>Altere os dados do registro</DialogDescription>
          </DialogHeader>
          {editingRecord && (
            <AddCapacitacaoDialog
              open={showEditDialog}
              onOpenChange={setShowEditDialog}
              onAdd={(data) => {
                handleEditRecord({ ...data, id: editingRecord.id })
                setShowEditDialog(false)
              }}
              assuntosDisponiveis={assuntos}
              initialData={editingRecord}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add Assunto Dialog */}
      <Dialog open={showAddAssuntoDialog} onOpenChange={setShowAddAssuntoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Assunto</DialogTitle>
            <DialogDescription>Insira um novo assunto de capacitação</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const novoAssunto = formData.get("assunto") as string
              if (novoAssunto.trim()) {
                handleAddAssunto(novoAssunto.trim())
                setShowAddAssuntoDialog(false)
              }
            }}
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="assunto">Nome do Assunto</Label>
                <Input id="assunto" name="assunto" placeholder="Ex: Treinamento de Vendas" required />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setShowAddAssuntoDialog(false)}>
                Cancelar
              </Button>
              <Button type="submit">Adicionar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <AddCapacitacaoDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAdd={handleAddCapacitacao}
        assuntosDisponiveis={assuntos}
      />
    </div>
  )
}
