"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, Edit, Trash2, Clock, CheckCircle } from "lucide-react"

interface Carteira {
  id: string
  nome: string
  total: number
  aplicados: number
  pendentes: number
}

interface TreinamentoTableProps {
  userRole: "admin" | "user"
  carteiras: Carteira[]
}

interface RegistroTreinamento {
  id: string
  quantidade: number
  quantidadePorTurno: number
  carteira: string
  data: string
  responsavel: string
  status: "aplicado" | "pendente"
  observacao?: string
}

export function TreinamentoTable({ userRole, carteiras }: TreinamentoTableProps) {
  const [registros, setRegistros] = useState<RegistroTreinamento[]>([
    {
      id: "1",
      quantidade: 15,
      quantidadePorTurno: 5,
      carteira: "CAIXA",
      data: "2024-01-15",
      responsavel: "João Silva",
      status: "aplicado",
      observacao: "Treinamento sobre novos procedimentos",
    },
    {
      id: "2",
      quantidade: 10,
      quantidadePorTurno: 10,
      carteira: "BTG",
      data: "2024-01-14",
      responsavel: "Maria Santos",
      status: "pendente",
      observacao: "Aguardando material",
    },
    {
      id: "3",
      quantidade: 8,
      quantidadePorTurno: 4,
      carteira: "WILLBANK",
      data: "2024-01-13",
      responsavel: "Pedro Costa",
      status: "aplicado",
    },
  ])

  const [novoRegistro, setNovoRegistro] = useState({
    quantidade: "",
    quantidadePorTurno: "",
    carteira: "",
    data: new Date().toISOString().split("T")[0],
    responsavel: "",
    status: "pendente" as "aplicado" | "pendente",
    observacao: "",
  })

  const [showForm, setShowForm] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!novoRegistro.quantidade || !novoRegistro.carteira || !novoRegistro.responsavel) return

    const registro: RegistroTreinamento = {
      id: Date.now().toString(),
      quantidade: Number.parseInt(novoRegistro.quantidade),
      quantidadePorTurno: Number.parseInt(novoRegistro.quantidadePorTurno) || 0,
      carteira: novoRegistro.carteira,
      data: novoRegistro.data,
      responsavel: novoRegistro.responsavel,
      status: novoRegistro.status,
      observacao: novoRegistro.observacao,
    }

    setRegistros([registro, ...registros])
    setNovoRegistro({
      quantidade: "",
      quantidadePorTurno: "",
      carteira: "",
      data: new Date().toISOString().split("T")[0],
      responsavel: "",
      status: "pendente",
      observacao: "",
    })
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    setRegistros(registros.filter((r) => r.id !== id))
  }

  const handleStatusChange = (id: string, newStatus: "aplicado" | "pendente") => {
    setRegistros(registros.map((r) => (r.id === id ? { ...r, status: newStatus } : r)))
  }

  const getStatusBadge = (status: "aplicado" | "pendente") => {
    return status === "aplicado" ? (
      <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
        <CheckCircle className="w-3 h-3 mr-1" />
        Aplicado
      </Badge>
    ) : (
      <Badge variant="outline" className="text-yellow-500 border-yellow-500/50">
        <Clock className="w-3 h-3 mr-1" />
        Pendente
      </Badge>
    )
  }

  return (
    <div className="space-y-4">
      {userRole === "admin" && (
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Registros de Treinamento</h3>
          <Button size="sm" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Treinamento
          </Button>
        </div>
      )}

      {showForm && userRole === "admin" && (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-border rounded-lg bg-muted/30">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <div className="space-y-2">
              <Label htmlFor="quantidadePorTurno">Quantidade por Turno</Label>
              <Input
                id="quantidadePorTurno"
                type="number"
                placeholder="0"
                value={novoRegistro.quantidadePorTurno}
                onChange={(e) => setNovoRegistro({ ...novoRegistro, quantidadePorTurno: e.target.value })}
              />
            </div>
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
                  {carteiras.map((carteira) => (
                    <SelectItem key={carteira.id} value={carteira.nome}>
                      {carteira.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
              <Label htmlFor="responsavel">Responsável</Label>
              <Input
                id="responsavel"
                placeholder="Nome do responsável"
                value={novoRegistro.responsavel}
                onChange={(e) => setNovoRegistro({ ...novoRegistro, responsavel: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={novoRegistro.status}
                onValueChange={(value: "aplicado" | "pendente") => setNovoRegistro({ ...novoRegistro, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="aplicado">Aplicado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="observacao">Observação</Label>
            <Input
              id="observacao"
              placeholder="Observação opcional"
              value={novoRegistro.observacao}
              onChange={(e) => setNovoRegistro({ ...novoRegistro, observacao: e.target.value })}
            />
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
              <TableHead>Carteira</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Por Turno</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Observação</TableHead>
              {userRole === "admin" && <TableHead className="w-24">Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {registros.length === 0 ? (
              <TableRow>
                <TableCell colSpan={userRole === "admin" ? 8 : 7} className="text-center text-muted-foreground py-8">
                  Nenhum registro encontrado
                </TableCell>
              </TableRow>
            ) : (
              registros.map((registro) => (
                <TableRow key={registro.id}>
                  <TableCell className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    {new Date(registro.data).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{registro.carteira}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{registro.quantidade}</TableCell>
                  <TableCell>{registro.quantidadePorTurno || "-"}</TableCell>
                  <TableCell>{registro.responsavel}</TableCell>
                  <TableCell>
                    {userRole === "admin" ? (
                      <Select
                        value={registro.status}
                        onValueChange={(value: "aplicado" | "pendente") => handleStatusChange(registro.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="aplicado">Aplicado</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      getStatusBadge(registro.status)
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-32 truncate">
                    {registro.observacao || "-"}
                  </TableCell>
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
