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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CapacitacaoRecord, Turno, Carteira, StatusCapacitacao, AssuntoCapacitacao } from "@/lib/data"
import { turnosDisponiveis, carteirasDisponiveis } from "@/lib/data"

interface AddCapacitacaoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (capacitacao: Omit<CapacitacaoRecord, "id">) => void
  assuntosDisponiveis: string[]
}

export function AddCapacitacaoDialog({ open, onOpenChange, onAdd, assuntosDisponiveis }: AddCapacitacaoDialogProps) {
  const [formData, setFormData] = useState({
    quantidade: "",
    turno: "" as Turno,
    carteira: "" as Carteira,
    data: new Date().toISOString().split("T")[0],
    responsavel: "",
    status: "" as StatusCapacitacao,
    assunto: "" as AssuntoCapacitacao,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onAdd({
      quantidade: Number.parseInt(formData.quantidade),
      turno: formData.turno,
      carteira: formData.carteira,
      data: formData.data,
      responsavel: formData.responsavel,
      status: formData.status,
      assunto: formData.assunto,
    })

    // Reset form
    setFormData({
      quantidade: "",
      turno: "" as Turno,
      carteira: "" as Carteira,
      data: new Date().toISOString().split("T")[0],
      responsavel: "",
      status: "" as StatusCapacitacao,
      assunto: "" as AssuntoCapacitacao,
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Capacitação</DialogTitle>
          <DialogDescription>Registre um novo treinamento ou capacitação</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade</Label>
              <Input
                id="quantidade"
                type="number"
                min="1"
                value={formData.quantidade}
                onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data">Data</Label>
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
              <Label htmlFor="turno">Turno</Label>
              <Select
                value={formData.turno}
                onValueChange={(value: Turno) => setFormData({ ...formData, turno: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {turnosDisponiveis
                    .filter((t) => t.value !== "geral")
                    .map((turno) => (
                      <SelectItem key={turno.value} value={turno.value}>
                        {turno.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="carteira">Carteira</Label>
              <Select
                value={formData.carteira}
                onValueChange={(value: Carteira) => setFormData({ ...formData, carteira: value })}
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="assunto">Assunto da Capacitação</Label>
            <Select
              value={formData.assunto}
              onValueChange={(value: AssuntoCapacitacao) => setFormData({ ...formData, assunto: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o assunto" />
              </SelectTrigger>
              <SelectContent>
                {assuntosDisponiveis.map((assunto) => (
                  <SelectItem key={assunto} value={assunto}>
                    {assunto}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: StatusCapacitacao) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aplicado">Aplicado</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
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
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Adicionar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
