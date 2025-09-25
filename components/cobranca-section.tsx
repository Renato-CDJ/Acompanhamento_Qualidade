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
import { mockEstatisticasCobranca, mockEstatisticasCobrancaGeral, carteirasDisponiveis, registrarCarteira } from "@/lib/data"

interface CobrancaSectionProps {
  selectedTurno: Turno
}

export function CobrancaSection({ selectedTurno }: CobrancaSectionProps) {
  const { user } = useAuth()
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showGerenciarCarteirasDialog, setShowGerenciarCarteirasDialog] = useState(false)
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
  function handleAddCarteiraForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const novaCarteira = (formData.get("carteira") as string).trim().toUpperCase()
    if (novaCarteira && !carteiras.includes(novaCarteira)) {
      setCarteiras([...carteiras, novaCarteira])
      if (typeof registrarCarteira === "function") {
        registrarCarteira(novaCarteira)
      }
      (e.target as HTMLFormElement).reset()
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
          <Button variant="outline" onClick={() => setShowGerenciarCarteirasDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Gerenciar Carteiras
          </Button>
        </div>
      )}

      {/* Gerenciar Carteiras Dialog */}
  <Dialog open={showGerenciarCarteirasDialog} onOpenChange={setShowGerenciarCarteirasDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerenciar Carteiras</DialogTitle>
            <DialogDescription>Adicione, edite ou exclua carteiras de cobrança</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <form onSubmit={handleAddCarteiraForm}>
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Label htmlFor="carteira">Nova Carteira</Label>
                  <Input id="carteira" name="carteira" placeholder="Ex: NOVA CARTEIRA" required />
                </div>
                <Button type="submit" variant="default">
                  <Plus className="h-4 w-4 mr-1" /> Adicionar
                </Button>
              </div>
            </form>
            <div className="border-t my-2" />
            <ul className="space-y-2">
              {carteiras.length === 0 && (
                <li className="text-muted-foreground text-sm">Nenhuma carteira cadastrada.</li>
              )}
              {carteiras.map((carteira, index) => (
                <li key={carteira} className="flex items-center justify-between bg-background rounded px-3 py-2">
                  <span className="text-sm max-w-40 truncate">{carteira}</span>
                  <div className="flex gap-2">
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
                </li>
              ))}
            </ul>
          </div>
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
