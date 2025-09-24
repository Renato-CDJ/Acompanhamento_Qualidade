"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { DesligamentoRecord, Turno } from "@/lib/data"
import { carteirasDisponiveis } from "@/lib/data"

const turnosDisponiveis = [
  { value: "manha" as Turno, label: "Manhã" },
  { value: "tarde" as Turno, label: "Tarde" },
  { value: "integral" as Turno, label: "Integral" },
]

interface AddDesligamentoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (desligamento: Omit<DesligamentoRecord, "id">) => void
}

export function AddDesligamentoDialog({ open, onOpenChange, onAdd }: AddDesligamentoDialogProps) {
  const [formData, setFormData] = useState({
    nome: "",
    carteira: "",
    turno: "" as Turno,
    data: new Date().toISOString().split("T")[0],
    motivo: "", // Mudado para string livre
    avisoPrevio: false,
    responsavel: "",
    veioDeAgencia: false,
    observacao: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onAdd({
      nome: formData.nome,
      carteira: formData.carteira,
      turno: formData.turno,
      data: formData.data,
      motivo: formData.motivo,
      avisoPrevio: formData.avisoPrevio,
      responsavel: formData.responsavel,
      veioDeAgencia: formData.veioDeAgencia,
      observacao: formData.observacao,
    })

    // Reset form
    setFormData({
      nome: "",
      carteira: "",
      turno: "" as Turno,
      data: new Date().toISOString().split("T")[0],
      motivo: "",
      avisoPrevio: false,
      responsavel: "",
      veioDeAgencia: false,
      observacao: "",
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar Desligamento</DialogTitle>
          <DialogDescription>Registre um novo desligamento de funcionário</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Funcionário</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Nome completo"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data">Data do Desligamento</Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="carteira">Carteira</Label>
              <Select
                value={formData.carteira}
                onValueChange={(value) => setFormData({ ...formData, carteira: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {carteirasDisponiveis.map((carteira) => (
                    <SelectItem key={carteira} value={carteira}>
                      {carteira}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="turno">Turno</Label>
              <Select
                value={formData.turno}
                onValueChange={(value: Turno) => setFormData({ ...formData, turno: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {turnosDisponiveis.map((turno) => (
                    <SelectItem key={turno.value} value={turno.value}>
                      {turno.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="motivo">Motivo do Desligamento</Label>
            <Input
              id="motivo"
              value={formData.motivo}
              onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
              placeholder="Descreva o motivo do desligamento"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsavel">Responsável</Label>
            <Input
              id="responsavel"
              value={formData.responsavel}
              onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
              placeholder="Nome do responsável"
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="avisoPrevio"
                checked={formData.avisoPrevio}
                onCheckedChange={(checked) => setFormData({ ...formData, avisoPrevio: checked as boolean })}
              />
              <Label htmlFor="avisoPrevio">Com Aviso Prévio</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="veioDeAgencia"
                checked={formData.veioDeAgencia}
                onCheckedChange={(checked) => setFormData({ ...formData, veioDeAgencia: checked as boolean })}
              />
              <Label htmlFor="veioDeAgencia">Veio de Agência</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacao">Observação</Label>
            <Textarea
              id="observacao"
              value={formData.observacao}
              onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
              placeholder="Observações sobre o desligamento"
              rows={3}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Registrar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
