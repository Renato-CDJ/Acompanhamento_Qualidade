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
import type { OperadorTreinado, Turno, Carteira, AssuntoCapacitacao } from "@/lib/data"
import { turnosDisponiveis, carteirasDisponiveis, assuntosCapacitacao } from "@/lib/data"

interface AddTreinadoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (treinado: Omit<OperadorTreinado, "id">) => void
}

export function AddTreinadoDialog({ open, onOpenChange, onAdd }: AddTreinadoDialogProps) {
  const [formData, setFormData] = useState({
    nome: "",
    carteira: "" as Carteira,
    turno: "" as Turno,
    dataInicio: "",
    dataConclusao: "",
    assunto: "" as AssuntoCapacitacao,
    responsavel: "",
    observacao: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (new Date(formData.dataInicio) > new Date(formData.dataConclusao)) {
      alert("A data de início deve ser anterior à data de conclusão")
      return
    }

    onAdd({
      nome: formData.nome,
      carteira: formData.carteira,
      turno: formData.turno,
      dataInicio: formData.dataInicio,
      dataConclusao: formData.dataConclusao,
      assunto: formData.assunto,
      responsavel: formData.responsavel,
      observacao: formData.observacao,
    })

    // Reset form
    setFormData({
      nome: "",
      carteira: "" as Carteira,
      turno: "" as Turno,
      dataInicio: "",
      dataConclusao: "",
      assunto: "" as AssuntoCapacitacao,
      responsavel: "",
      observacao: "",
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Operador Treinado</DialogTitle>
          <DialogDescription>Registre um operador que concluiu o treinamento</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Operador</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Nome completo"
                required
              />
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
              <Label htmlFor="assunto">Assunto do Treinamento</Label>
              <Select
                value={formData.assunto}
                onValueChange={(value: AssuntoCapacitacao) => setFormData({ ...formData, assunto: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {assuntosCapacitacao.map((assunto) => (
                    <SelectItem key={assunto} value={assunto}>
                      {assunto}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataInicio">Data de Início</Label>
              <Input
                id="dataInicio"
                type="date"
                value={formData.dataInicio}
                onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataConclusao">Data de Conclusão</Label>
              <Input
                id="dataConclusao"
                type="date"
                value={formData.dataConclusao}
                onChange={(e) => setFormData({ ...formData, dataConclusao: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsavel">Responsável pelo Treinamento</Label>
            <Input
              id="responsavel"
              value={formData.responsavel}
              onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
              placeholder="Nome do responsável"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacao">Observação</Label>
            <Textarea
              id="observacao"
              value={formData.observacao}
              onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
              placeholder="Observações sobre o treinamento e desempenho do operador"
              rows={3}
              required
            />
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
