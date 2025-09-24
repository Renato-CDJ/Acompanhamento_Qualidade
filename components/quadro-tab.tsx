"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Users, Calendar } from "lucide-react"
import { CaixaSection } from "@/components/caixa-section"
import { CobrancaSection } from "@/components/cobranca-section"
import type { Turno } from "@/lib/data"

export function QuadroTab() {
  const [selectedTurno, setSelectedTurno] = useState<Turno>("geral")

  return (
    <div className="space-y-6">
      {/* Header with Turno Filter */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quadro de Funcionários</h2>
          <p className="text-muted-foreground">Gerencie o quadro por setor e turno</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Turno:</span>
          </div>
          <Select value={selectedTurno} onValueChange={(value: Turno) => setSelectedTurno(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="geral">Geral</SelectItem>
              <SelectItem value="manha">Manhã</SelectItem>
              <SelectItem value="tarde">Tarde</SelectItem>
              <SelectItem value="integral">Integral</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Setor Tabs */}
      <Tabs defaultValue="caixa" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="caixa" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Caixa
          </TabsTrigger>
          <TabsTrigger value="cobranca" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Cobrança
          </TabsTrigger>
        </TabsList>

        <TabsContent value="caixa">
          <CaixaSection selectedTurno={selectedTurno} />
        </TabsContent>

        <TabsContent value="cobranca">
          <CobrancaSection selectedTurno={selectedTurno} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
