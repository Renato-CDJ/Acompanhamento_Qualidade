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
import type { EstatisticaCobranca, Turno, Carteira } from "@/lib/data"
import { turnosDisponiveis } from "@/lib/data"

interface AddCobrancaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (estatistica: Omit<EstatisticaCobranca, "id">) => void
  carteirasDisponiveis: string[]
}

export function AddCobrancaDialog({ open, onOpenChange, onAdd, carteirasDisponiveis }: AddCobrancaDialogProps) {
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split("T")[0],
    turno: "" as Turno,
    carteira: "" as Carteira,
    total: "",
    presentes: "",
    faltas: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const total = Number.parseInt(formData.total)
    const presentes = Number.parseInt(formData.presentes)
    const faltas = Number.parseInt(formData.faltas)

    // Validation
    if (presentes + faltas !== total) {
      alert("A soma de Presentes + Faltas deve ser igual ao Total")
      return
    }

    const abs = total > 0 ? (faltas / total) * 100 : 0

    onAdd({
      data: formData.data,
      turno: formData.turno,
      carteira: formData.carteira,
      total,
      presentes,
      faltas,
      abs,
    })

    // Reset form
    setFormData({
      data: new Date().toISOString().split("T")[0],
      turno: "" as Turno,
      carteira: "" as Carteira,
      total: "",
      presentes: "",
      faltas: "",
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Registro - Cobrança</DialogTitle>
          <DialogDescription>Adicione um novo registro diário para o setor Cobrança</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="carteira">Carteira</Label>
            <Select
              value={formData.carteira}
              onValueChange={(value: Carteira) => setFormData({ ...formData, carteira: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a carteira" />
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

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="total">Total</Label>
              <Input
                id="total"
                type="number"
                min="0"
                value={formData.total}
                onChange={(e) => setFormData({ ...formData, total: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="presentes">Presentes</Label>
              <Input
                id="presentes"
                type="number"
                min="0"
                value={formData.presentes}
                onChange={(e) => setFormData({ ...formData, presentes: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="faltas">Faltas</Label>
              <Input
                id="faltas"
                type="number"
                min="0"
                value={formData.faltas}
                onChange={(e) => setFormData({ ...formData, faltas: e.target.value })}
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
