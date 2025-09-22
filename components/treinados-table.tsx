"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, Edit, Trash2, CheckCircle, Clock, User } from "lucide-react"

interface TreinadosTableProps {
  userRole: "admin" | "user"
}

interface RegistroTreinado {
  id: string
  nome: string
  carteira: string
  dataInicio: string
  dataConclusao: string
  status: "ativo" | "experiencia" | "aprovado" | "desligado"
  responsavel: string
  observacao?: string
  nota?: number
}

export function TreinadosTable({ userRole }: TreinadosTableProps) {
  const [registros, setRegistros] = useState<RegistroTreinado[]>([
    {
      id: "1",
      nome: "João Silva Santos",
      carteira: "CAIXA",
      dataInicio: "2024-01-10",
      dataConclusao: "2024-01-15",
      status: "aprovado",
      responsavel: "Maria Costa",
      observacao: "Excelente desempenho",
      nota: 9.5,
    },
    {
      id: "2",
      nome: "Ana Paula Oliveira",
      carteira: "BTG",
      dataInicio: "2024-01-12",
      dataConclusao: "2024-01-17",
      status: "experiencia",
      responsavel: "Pedro Santos",
      observacao: "Em período de avaliação",
      nota: 8.0,
    },
    {
      id: "3",
      nome: "Carlos Eduardo Lima",
      carteira: "WILLBANK",
      dataInicio: "2024-01-08",
      dataConclusao: "2024-01-13",
      status: "ativo",
      responsavel: "Lucia Ferreira",
      nota: 8.5,
    },
  ])

  const [novoRegistro, setNovoRegistro] = useState({
    nome: "",
    carteira: "",
    dataInicio: new Date().toISOString().split("T")[0],
    dataConclusao: "",
    status: "experiencia" as "ativo" | "experiencia" | "aprovado" | "desligado",
    responsavel: "",
    observacao: "",
    nota: "",
  })

  const [showForm, setShowForm] = useState(false)

  const carteiras = ["CAIXA", "BTG", "WILLBANK", "PEFISA", "SANTANDER"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!novoRegistro.nome || !novoRegistro.carteira || !novoRegistro.responsavel) return

    const registro: RegistroTreinado = {
      id: Date.now().toString(),
      nome: novoRegistro.nome,
      carteira: novoRegistro.carteira,
      dataInicio: novoRegistro.dataInicio,
      dataConclusao: novoRegistro.dataConclusao,
      status: novoRegistro.status,
      responsavel: novoRegistro.responsavel,
      observacao: novoRegistro.observacao,
      nota: novoRegistro.nota ? Number.parseFloat(novoRegistro.nota) : undefined,
    }

    setRegistros([registro, ...registros])
    setNovoRegistro({
      nome: "",
      carteira: "",
      dataInicio: new Date().toISOString().split("T")[0],
      dataConclusao: "",
      status: "experiencia",
      responsavel: "",
      observacao: "",
      nota: "",
    })
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    setRegistros(registros.filter((r) => r.id !== id))
  }

  const handleStatusChange = (id: string, newStatus: "ativo" | "experiencia" | "aprovado" | "desligado") => {
    setRegistros(registros.map((r) => (r.id === id ? { ...r, status: newStatus } : r)))
  }

  const getStatusBadge = (status: "ativo" | "experiencia" | "aprovado" | "desligado") => {
    const statusConfig = {
      ativo: { color: "bg-green-500/10 text-green-500", icon: CheckCircle, label: "Ativo" },
      experiencia: { color: "bg-yellow-500/10 text-yellow-500", icon: Clock, label: "Experiência" },
      aprovado: { color: "bg-purple-500/10 text-purple-500", icon: CheckCircle, label: "Aprovado" },
      desligado: { color: "bg-red-500/10 text-red-500", icon: User, label: "Desligado" },
    }

    const config = statusConfig[status]
    const Icon = config.icon

    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const getNotaBadge = (nota?: number) => {
    if (!nota) return null

    let color = "bg-gray-500/10 text-gray-500"
    if (nota >= 9) color = "bg-green-500/10 text-green-500"
    else if (nota >= 8) color = "bg-blue-500/10 text-blue-500"
    else if (nota >= 7) color = "bg-yellow-500/10 text-yellow-500"
    else color = "bg-red-500/10 text-red-500"

    return (
      <Badge variant="outline" className={color}>
        {nota.toFixed(1)}
      </Badge>
    )
  }

  return (
    <div className="space-y-4">
      {userRole === "admin" && (
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Funcionários Treinados</h3>
          <Button size="sm" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Registro
          </Button>
        </div>
      )}

      {showForm && userRole === "admin" && (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-border rounded-lg bg-muted/30">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                placeholder="Nome do funcionário"
                value={novoRegistro.nome}
                onChange={(e) => setNovoRegistro({ ...novoRegistro, nome: e.target.value })}
                required
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
                    <SelectItem key={carteira} value={carteira}>
                      {carteira}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataInicio">Data de Início</Label>
              <Input
                id="dataInicio"
                type="date"
                value={novoRegistro.dataInicio}
                onChange={(e) => setNovoRegistro({ ...novoRegistro, dataInicio: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataConclusao">Data de Conclusão</Label>
              <Input
                id="dataConclusao"
                type="date"
                value={novoRegistro.dataConclusao}
                onChange={(e) => setNovoRegistro({ ...novoRegistro, dataConclusao: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={novoRegistro.status}
                onValueChange={(value: "ativo" | "experiencia" | "aprovado" | "desligado") =>
                  setNovoRegistro({ ...novoRegistro, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="experiencia">Em Experiência</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="aprovado">Aprovado</SelectItem>
                  <SelectItem value="desligado">Desligado</SelectItem>
                </SelectContent>
              </Select>
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
              <Label htmlFor="nota">Nota (0-10)</Label>
              <Input
                id="nota"
                type="number"
                min="0"
                max="10"
                step="0.1"
                placeholder="8.5"
                value={novoRegistro.nota}
                onChange={(e) => setNovoRegistro({ ...novoRegistro, nota: e.target.value })}
              />
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
              <TableHead>Nome</TableHead>
              <TableHead>Carteira</TableHead>
              <TableHead>Início</TableHead>
              <TableHead>Conclusão</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Nota</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Observação</TableHead>
              {userRole === "admin" && <TableHead className="w-24">Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {registros.length === 0 ? (
              <TableRow>
                <TableCell colSpan={userRole === "admin" ? 9 : 8} className="text-center text-muted-foreground py-8">
                  Nenhum registro encontrado
                </TableCell>
              </TableRow>
            ) : (
              registros.map((registro) => (
                <TableRow key={registro.id}>
                  <TableCell className="font-medium">{registro.nome}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{registro.carteira}</Badge>
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    {new Date(registro.dataInicio).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    {registro.dataConclusao ? new Date(registro.dataConclusao).toLocaleDateString("pt-BR") : "-"}
                  </TableCell>
                  <TableCell>
                    {userRole === "admin" ? (
                      <Select
                        value={registro.status}
                        onValueChange={(value: "ativo" | "experiencia" | "aprovado" | "desligado") =>
                          handleStatusChange(registro.id, value)
                        }
                      >
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="experiencia">Em Experiência</SelectItem>
                          <SelectItem value="ativo">Ativo</SelectItem>
                          <SelectItem value="aprovado">Aprovado</SelectItem>
                          <SelectItem value="desligado">Desligado</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      getStatusBadge(registro.status)
                    )}
                  </TableCell>
                  <TableCell>{getNotaBadge(registro.nota)}</TableCell>
                  <TableCell>{registro.responsavel}</TableCell>
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
