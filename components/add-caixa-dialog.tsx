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
import type { EstatisticaCaixa, Turno } from "@/lib/data"
import { turnosDisponiveis } from "@/lib/data"

interface TipoEstatistica {
  id: string
  nome: string
  cor: string
  icone: string
}

interface AddCaixaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (estatistica: Omit<EstatisticaCaixa, "id">) => void
  tiposEstatisticas: TipoEstatistica[]
}

export function AddCaixaDialog({ open, onOpenChange, onAdd, tiposEstatisticas }: AddCaixaDialogProps) {
  const [formData, setFormData] = useState<Record<string, string>>({
    data: new Date().toISOString().split("T")[0],
    turno: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const valores: Record<string, number> = {}
    let total = 0

    for (const tipo of tiposEstatisticas) {
      const valor = Number.parseInt(formData[tipo.id] || "0")
      valores[tipo.id] = valor
      if (tipo.id !== "total") {
        total += valor
      }
    }

    // Validation - soma deve ser igual ao total
    if (valores.total && valores.total !== total) {
      const nomesCampos = tiposEstatisticas
        .filter((t) => t.id !== "total")
        .map((t) => t.nome)
        .join(" + ")
      alert(`A soma de ${nomesCampos} deve ser igual ao Total`)
      return
    }

    // Se não há campo total, calcular automaticamente
    if (!valores.total) {
      valores.total = total
    }

    onAdd({
      data: formData.data,
      turno: formData.turno as Turno,
      ...valores,
    } as Omit<EstatisticaCaixa, "id">)

    // Reset form
    const resetData: Record<string, string> = {
      data: new Date().toISOString().split("T")[0],
      turno: "",
    }
    tiposEstatisticas.forEach((tipo) => {
      resetData[tipo.id] = ""
    })
    setFormData(resetData)

    onOpenChange(false)
  }

  const updateFormData = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Registro - Caixa</DialogTitle>
          <DialogDescription>Adicione um novo registro diário para o setor Caixa</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) => updateFormData("data", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="turno">Turno</Label>
              <Select value={formData.turno} onValueChange={(value: Turno) => updateFormData("turno", value)}>
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

          <div className="grid grid-cols-2 gap-4">
            {tiposEstatisticas.map((tipo) => (
              <div key={tipo.id} className="space-y-2">
                <Label htmlFor={tipo.id}>{tipo.nome}</Label>
                <Input
                  id={tipo.id}
                  type="number"
                  min="0"
                  value={formData[tipo.id] || ""}
                  onChange={(e) => updateFormData(tipo.id, e.target.value)}
                  required
                />
              </div>
            ))}
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
