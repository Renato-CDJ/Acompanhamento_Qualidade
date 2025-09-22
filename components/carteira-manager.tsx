"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, X } from "lucide-react"

interface Carteira {
  id: string
  nome: string
  total: number
  aplicados: number
  pendentes: number
}

interface CarteiraManagerProps {
  carteiras: Carteira[]
  onAddCarteira: (nome: string) => void
  onRemoveCarteira: (id: string) => void
  onClose: () => void
}

export function CarteiraManager({ carteiras, onAddCarteira, onRemoveCarteira, onClose }: CarteiraManagerProps) {
  const [novaCarteira, setNovaCarteira] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!novaCarteira.trim()) return

    onAddCarteira(novaCarteira.trim())
    setNovaCarteira("")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Carteiras Cadastradas</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Formulário para adicionar nova carteira */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="nova-carteira" className="sr-only">
            Nome da carteira
          </Label>
          <Input
            id="nova-carteira"
            placeholder="Nome da nova carteira (ex: BANCO DO BRASIL)"
            value={novaCarteira}
            onChange={(e) => setNovaCarteira(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={!novaCarteira.trim()}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar
        </Button>
      </form>

      {/* Lista de carteiras */}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {carteiras.map((carteira) => (
          <div key={carteira.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <Badge variant="outline">{carteira.nome}</Badge>
              <div className="text-sm text-muted-foreground">
                {carteira.total} treinamentos • {carteira.aplicados} aplicados • {carteira.pendentes} pendentes
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveCarteira(carteira.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {carteiras.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Nenhuma carteira cadastrada</p>
          <p className="text-sm">Adicione uma carteira para começar</p>
        </div>
      )}
    </div>
  )
}
