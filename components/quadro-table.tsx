"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, Edit, Trash2 } from "lucide-react"

interface QuadroTableProps {
  userRole: "admin" | "user"
  area: string
  activeTab: string
  turno?: string
  onChangeRegistros?: (registros: RegistroQuadro[]) => void
}

interface RegistroQuadro {
  id: string
  data: string
  tipo: "total" | "ativos" | "ferias" | "afastamento" | "inss"
  quantidade: number
  turno?: string
  carteira?: string
  capacity?: number
  presentes?: number
  faltas?: number
  observacao?: string
}

export function QuadroTable({ userRole, area, activeTab, turno, onChangeRegistros }: QuadroTableProps) {
  const [registros, setRegistros] = useState<RegistroQuadro[]>([])

  const [novoRegistro, setNovoRegistro] = useState({
    data: new Date().toISOString().split("T")[0],
    tipo: activeTab as "total" | "ativos" | "ferias" | "afastamento" | "inss",
    quantidade: "",
    turno: turno || "geral",
    carteira: "",
    capacity: "",
    presentes: "",
    faltas: "",
    observacao: "",
  })

  const [showForm, setShowForm] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!novoRegistro.quantidade) return

    const registro: RegistroQuadro = {
      id: Date.now().toString(),
      data: novoRegistro.data,
      tipo: novoRegistro.tipo,
      quantidade: Number.parseInt(novoRegistro.quantidade),
      turno: turno || "geral",
      carteira: area === "Cobrança" ? novoRegistro.carteira : undefined,
      observacao: novoRegistro.observacao,
      ...(area === "Cobrança" && {
        capacity: novoRegistro.capacity ? Number.parseInt(novoRegistro.capacity) : undefined,
        presentes: novoRegistro.presentes ? Number.parseInt(novoRegistro.presentes) : undefined,
        faltas: novoRegistro.faltas ? Number.parseInt(novoRegistro.faltas) : undefined,
      })
    }

    setRegistros([registro, ...registros])
    if (typeof onChangeRegistros === "function") {
      onChangeRegistros([registro, ...registros])
    }
    setNovoRegistro({
      data: new Date().toISOString().split("T")[0],
      tipo: activeTab as "total" | "ativos" | "ferias" | "afastamento" | "inss",
      quantidade: "",
      turno: turno || "geral",
      carteira: "",
      capacity: "",
      presentes: "",
      faltas: "",
      observacao: "",
    })
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    setRegistros(registros.filter((r) => r.id !== id))
  }

  const getTipoBadge = (tipo: string) => {
    const colors = {
      total: "bg-blue-500/10 text-blue-500",
      ativos: "bg-green-500/10 text-green-500",
      ferias: "bg-yellow-500/10 text-yellow-500",
      afastamento: "bg-orange-500/10 text-orange-500",
      inss: "bg-purple-500/10 text-purple-500",
    }
    return colors[tipo as keyof typeof colors] || colors.total
  }

  const filteredRegistros = registros.filter((r) => {
    const tipoMatch = activeTab === "total" || r.tipo === activeTab
    const turnoMatch = turno ? (r.turno === turno) : true
    return tipoMatch && turnoMatch
  })

  return (
    <div className="space-y-4">
      {userRole === "admin" && (
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Registros Recentes</h3>
          <Button size="sm" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Registro
          </Button>
        </div>
      )}

      {showForm && userRole === "admin" && (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-border rounded-lg bg-muted/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {area === "Cobrança" && (
              <div className="space-y-2">
                <Label htmlFor="carteira">Carteira</Label>
                <Select
                  value={novoRegistro.carteira}
                  onValueChange={(value) => setNovoRegistro({ ...novoRegistro, carteira: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a carteira" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Carteira 1">Carteira 1</SelectItem>
                    <SelectItem value="Carteira 2">Carteira 2</SelectItem>
                    <SelectItem value="Carteira 3">Carteira 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                type="date"
                value={novoRegistro.data}
                onChange={(e) => setNovoRegistro({ ...novoRegistro, data: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select
                value={novoRegistro.tipo}
                onValueChange={(value: "total" | "ativos" | "ferias" | "afastamento" | "inss") =>
                  setNovoRegistro({ ...novoRegistro, tipo: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="total">Total</SelectItem>
                  <SelectItem value="ativos">Ativos</SelectItem>
                  <SelectItem value="ferias">Férias</SelectItem>
                  <SelectItem value="afastamento">Afastamento</SelectItem>
                  <SelectItem value="inss">INSS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade</Label>
              <Input
                id="quantidade"
                type="number"
                placeholder="0"
                value={novoRegistro.quantidade}
                onChange={(e) => setNovoRegistro({ ...novoRegistro, quantidade: e.target.value })}
                required
              />
            </div>
            {area === "Cobrança" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    placeholder="Capacity"
                    value={novoRegistro.capacity}
                    onChange={(e) => setNovoRegistro({ ...novoRegistro, capacity: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="presentes">Presentes</Label>
                  <Input
                    id="presentes"
                    type="number"
                    placeholder="Presentes"
                    value={novoRegistro.presentes}
                    onChange={(e) => setNovoRegistro({ ...novoRegistro, presentes: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="faltas">Faltas</Label>
                  <Input
                    id="faltas"
                    type="number"
                    placeholder="Faltas"
                    value={novoRegistro.faltas}
                    onChange={(e) => setNovoRegistro({ ...novoRegistro, faltas: e.target.value })}
                  />
                </div>
              </>
            )}
            <div className="space-y-2 col-span-3">
              <Label htmlFor="observacao">Observação</Label>
              <Input
                id="observacao"
                placeholder="Observação opcional"
                value={novoRegistro.observacao}
                onChange={(e) => setNovoRegistro({ ...novoRegistro, observacao: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm">
              Salvar
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      )}

      <div className="border border-border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              {area === "Cobrança" && <TableHead>Carteira</TableHead>}
              <TableHead>Tipo</TableHead>
              <TableHead>Quantidade</TableHead>
              {area === "Cobrança" && <TableHead>Capacity</TableHead>}
              {area === "Cobrança" && <TableHead>Presentes</TableHead>}
              {area === "Cobrança" && <TableHead>Faltas</TableHead>}
              <TableHead>Observação</TableHead>
              {userRole === "admin" && <TableHead className="w-20">Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRegistros.length === 0 ? (
              <TableRow>
                <TableCell colSpan={userRole === "admin" ? 8 : 7} className="text-center text-muted-foreground py-8">
                  Nenhum registro encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredRegistros.map((registro) => (
                <TableRow key={registro.id}>
                  <TableCell className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    {new Date(registro.data).toLocaleDateString("pt-BR")}
                  </TableCell>
                  {area === "Cobrança" && <TableCell className="font-medium">{registro.carteira ?? '-'}</TableCell>}
      {/* Estatísticas por carteira - apenas Cobrança */}
      {area === "Cobrança" && (
        <div className="mt-8">
          <h4 className="text-lg font-bold mb-2">Estatísticas por Carteira</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Carteira</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Presentes</TableHead>
                <TableHead>Faltas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(() => {
                // Agrupa por carteira
                const stats: Record<string, { capacity: number; presentes: number; faltas: number }> = {};
                registros.forEach((r) => {
                  if (!r.carteira) return;
                  if (!stats[r.carteira]) stats[r.carteira] = { capacity: 0, presentes: 0, faltas: 0 };
                  stats[r.carteira].capacity += r.capacity || 0;
                  stats[r.carteira].presentes += r.presentes || 0;
                  stats[r.carteira].faltas += r.faltas || 0;
                });
                return Object.entries(stats).map(([carteira, valores]) => (
                  <TableRow key={carteira}>
                    <TableCell className="font-medium">{carteira}</TableCell>
                    <TableCell>{valores.capacity}</TableCell>
                    <TableCell>{valores.presentes}</TableCell>
                    <TableCell>{valores.faltas}</TableCell>
                  </TableRow>
                ));
              })()}
            </TableBody>
          </Table>
        </div>
      )}
                  <TableCell>
                    <Badge variant="outline" className={getTipoBadge(registro.tipo)}>
                      {registro.tipo.charAt(0).toUpperCase() + registro.tipo.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{registro.quantidade}</TableCell>
                  {area === "Cobrança" && <TableCell className="font-medium">{registro.capacity ?? '-'}</TableCell>}
                  {area === "Cobrança" && <TableCell className="font-medium">{registro.presentes ?? '-'}</TableCell>}
                  {area === "Cobrança" && <TableCell className="font-medium">{registro.faltas ?? '-'}</TableCell>}
                  <TableCell className="text-muted-foreground">{registro.observacao || "-"}</TableCell>
                  {userRole === "admin" && (
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(registro.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
