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
import { mockEstatisticasCobranca, mockEstatisticasCobrancaGeral, carteirasDisponiveis, adicionarCarteira } from "@/lib/data"

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
  // Estatísticas gerais
  const totalsGerais = estatisticasGerais.reduce(
    (acc, item) => ({
      total: acc.total + item.total,
      ativos: acc.ativos + item.ativos,
      ferias: acc.ferias + item.ferias,
      afastamento: acc.afastamento + item.afastamento,
    }),
    { total: 0, ativos: 0, ferias: 0, afastamento: 0 },
  )

  // Filtrar carteiras por turno
  const filteredCarteiras =
    selectedTurno === "geral"
      ? estatisticasPorCarteira
      : estatisticasPorCarteira.filter((item) => item.turno === selectedTurno)

  // Adicionar carteira
  const handleAddCarteira = (novaCarteira: string) => {
    if (!carteiras.includes(novaCarteira)) {
      setCarteiras([...carteiras, novaCarteira])
      adicionarCarteira(novaCarteira)
    }
  }

  // Editar carteira
  const handleEditCarteira = (novoNome: string) => {
    const newCarteiras = [...carteiras]
    newCarteiras[editingCarteiraIndex] = novoNome.toUpperCase()
    setCarteiras(newCarteiras)
  }

  // Excluir carteira
  const handleDeleteCarteira = (carteira: string) => {
    setCarteiras((prev) => prev.filter((c) => c !== carteira))
    setEstatisticasPorCarteira((prev) => prev.filter((e) => e.carteira !== carteira))
  }

  return (
    <div className="space-y-6">
      {/* Gerenciar Carteiras Dropdown */}
      {user?.role === "admin" && (
        <div className="flex justify-end mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Gerenciar Carteiras
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-[260px]">
              <DropdownMenuItem onClick={() => setShowAddCarteiraDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Carteira
              </DropdownMenuItem>
              <div className="border-t my-2" />
              {carteiras.length === 0 && (
                <div className="px-2 py-1 text-muted-foreground text-sm">Nenhuma carteira cadastrada.</div>
              )}
              {carteiras.map((carteira, index) => (
                <div key={carteira} className="flex items-center justify-between px-2 py-1">
                  <span className="text-sm max-w-[140px] truncate">{carteira}</span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingCarteira(carteira)
                        setEditingCarteiraIndex(index)
                        setShowEditCarteiraDialog(true)
                      }}
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCarteira(carteira)}
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

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
            <DialogDescription>Edite ou exclua as informações da carteira selecionada</DialogDescription>
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
              <Button type="button" variant="destructive" onClick={() => { handleDeleteCarteira(editingCarteira); setShowEditCarteiraDialog(false); }}>
                Excluir
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ...existing code... */}
    </div>
  )
}
