"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Plus, Edit, Trash2, FileText, AlertTriangle } from "lucide-react"

interface DesligamentosTableProps {
  userRole: "admin" | "user"
}

interface RegistroDesligamento {
  id: string
  nome: string
  carteira: string
  dataDesligamento: string
  motivoDesligamento: string
  avisoPrevia: "sim" | "nao"
  responsavel: string
  observacao?: string
  detalhesMotivo?: string
}

export function DesligamentosTable({ userRole }: DesligamentosTableProps) {
  const [registros, setRegistros] = useState<RegistroDesligamento[]>([
    {
      id: "1",
      nome: "Carlos Silva Santos",
      carteira: "CAIXA",
      dataDesligamento: "2024-01-15",
      motivoDesligamento: "Inadequação ao cargo",
      avisoPrevia: "sim",
      responsavel: "Maria Costa",
      observacao: "Dificuldades de adaptação às rotinas",
      detalhesMotivo: "Não conseguiu atingir as metas estabelecidas após período de treinamento",
    },
    {
      id: "2",
      nome: "Ana Paula Oliveira",
      carteira: "BTG",
      dataDesligamento: "2024-01-12",
      motivoDesligamento: "Questões disciplinares",
      avisoPrevia: "nao",
      responsavel: "Pedro Santos",
      observacao: "Faltas excessivas não justificadas",
      detalhesMotivo: "Múltiplas advertências por ausências",
    },
    {
      id: "3",
      nome: "Roberto Lima Costa",
      carteira: "WILLBANK",
      dataDesligamento: "2024-01-10",
      motivoDesligamento: "Pedido de demissão",
      avisoPrevia: "sim",
      responsavel: "Lucia Ferreira",
      observacao: "Oportunidade em outra empresa",
    },
  ])

  const [novoRegistro, setNovoRegistro] = useState({
    nome: "",
    carteira: "",
    dataDesligamento: new Date().toISOString().split("T")[0],
    motivoDesligamento: "",
    avisoPrevia: "sim" as "sim" | "nao",
    responsavel: "",
    observacao: "",
    detalhesMotivo: "",
  })

  const [showForm, setShowForm] = useState(false)

  const carteiras = ["CAIXA", "BTG", "WILLBANK", "PEFISA", "SANTANDER"]
  const motivos = [
    "Inadequação ao cargo",
    "Problemas de performance",
    "Questões disciplinares",
    "Pedido de demissão",
    "Reestruturação",
    "Outros",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!novoRegistro.nome || !novoRegistro.carteira || !novoRegistro.motivoDesligamento || !novoRegistro.responsavel)
      return

    const registro: RegistroDesligamento = {
      id: Date.now().toString(),
      nome: novoRegistro.nome,
      carteira: novoRegistro.carteira,
      dataDesligamento: novoRegistro.dataDesligamento,
      motivoDesligamento: novoRegistro.motivoDesligamento,
      avisoPrevia: novoRegistro.avisoPrevia,
      responsavel: novoRegistro.responsavel,
      observacao: novoRegistro.observacao,
      detalhesMotivo: novoRegistro.detalhesMotivo,
    }

    setRegistros([registro, ...registros])
    setNovoRegistro({
      nome: "",
      carteira: "",
      dataDesligamento: new Date().toISOString().split("T")[0],
      motivoDesligamento: "",
      avisoPrevia: "sim",
      responsavel: "",
      observacao: "",
      detalhesMotivo: "",
    })
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    setRegistros(registros.filter((r) => r.id !== id))
  }

  const getAvisoBadge = (aviso: "sim" | "nao") => {
    return aviso === "sim" ? (
      <Badge className="bg-blue-500/10 text-blue-500">
        <FileText className="w-3 h-3 mr-1" />
        Com Aviso
      </Badge>
    ) : (
      <Badge variant="outline" className="text-orange-500 border-orange-500/50">
        <AlertTriangle className="w-3 h-3 mr-1" />
        Sem Aviso
      </Badge>
    )
  }

  const getMotivoBadge = (motivo: string) => {
    const motivoColors: Record<string, string> = {
      "Inadequação ao cargo": "bg-red-500/10 text-red-500",
      "Problemas de performance": "bg-orange-500/10 text-orange-500",
      "Questões disciplinares": "bg-yellow-500/10 text-yellow-500",
      "Pedido de demissão": "bg-blue-500/10 text-blue-500",
      Reestruturação: "bg-purple-500/10 text-purple-500",
      Outros: "bg-gray-500/10 text-gray-500",
    }

    return (
      <Badge variant="outline" className={motivoColors[motivo] || motivoColors["Outros"]}>
        {motivo}
      </Badge>
    )
  }

  return (
    <div className="space-y-4">
      {userRole === "admin" && (
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Registros de Desligamento</h3>
          <Button size="sm" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Desligamento
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
              <Label htmlFor="dataDesligamento">Data do Desligamento</Label>
              <Input
                id="dataDesligamento"
                type="date"
                value={novoRegistro.dataDesligamento}
                onChange={(e) => setNovoRegistro({ ...novoRegistro, dataDesligamento: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="motivoDesligamento">Motivo do Desligamento</Label>
              <Select
                value={novoRegistro.motivoDesligamento}
                onValueChange={(value) => setNovoRegistro({ ...novoRegistro, motivoDesligamento: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o motivo" />
                </SelectTrigger>
                <SelectContent>
                  {motivos.map((motivo) => (
                    <SelectItem key={motivo} value={motivo}>
                      {motivo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="avisoPrevia">Aviso Prévio</Label>
              <Select
                value={novoRegistro.avisoPrevia}
                onValueChange={(value: "sim" | "nao") => setNovoRegistro({ ...novoRegistro, avisoPrevia: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sim">Com Aviso Prévio</SelectItem>
                  <SelectItem value="nao">Sem Aviso Prévio</SelectItem>
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="observacao">Observação</Label>
              <Textarea
                id="observacao"
                placeholder="Observações gerais sobre o desligamento"
                value={novoRegistro.observacao}
                onChange={(e) => setNovoRegistro({ ...novoRegistro, observacao: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="detalhesMotivo">Detalhes do Motivo</Label>
              <Textarea
                id="detalhesMotivo"
                placeholder="Detalhes específicos sobre o motivo do desligamento"
                value={novoRegistro.detalhesMotivo}
                onChange={(e) => setNovoRegistro({ ...novoRegistro, detalhesMotivo: e.target.value })}
                rows={3}
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
              <TableHead>Nome</TableHead>
              <TableHead>Carteira</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Motivo</TableHead>
              <TableHead>Aviso Prévio</TableHead>
              <TableHead>Responsável</TableHead>
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
                  <TableCell className="font-medium">{registro.nome}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{registro.carteira}</Badge>
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    {new Date(registro.dataDesligamento).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>{getMotivoBadge(registro.motivoDesligamento)}</TableCell>
                  <TableCell>{getAvisoBadge(registro.avisoPrevia)}</TableCell>
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
