"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { useTheme } from "@/lib/theme"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { LogOut, Users, GraduationCap, UserCheck, UserX, Sun, Moon, Monitor } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { QuadroTab } from "@/components/quadro-tab"
import { CapacitacaoTab } from "@/components/capacitacao-tab"
import { TreinadosTab } from "@/components/treinados-tab"
import { DesligamentosTab } from "@/components/desligamentos-tab"
import { AnalyticsOverview } from "@/components/analytics-overview"
import { mockCapacitacaoRecords } from "@/lib/data"

export function Dashboard() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("overview")

  const analyticsData = {
    totalFuncionarios: 165,
    totalAtivos: 140,
    totalTreinamentos: mockCapacitacaoRecords.reduce((acc, record) => acc + record.quantidade, 0),
    taxaRotatividade: 8.5,
    tendenciaRotatividade: "down" as const,
    distribuicaoTurnos: [
      { name: "Manhã", value: 65 },
      { name: "Tarde", value: 58 },
      { name: "Integral", value: 42 },
    ],
    evolucaoMensal: [
      { mes: "Out", ativos: 135, desligamentos: 8, treinamentos: 25 },
      { mes: "Nov", ativos: 142, desligamentos: 6, treinamentos: 32 },
      { mes: "Dez", ativos: 138, desligamentos: 9, treinamentos: 28 },
      { mes: "Jan", ativos: 140, desligamentos: 5, treinamentos: 35 },
    ],
  }

  const themeIcons = {
    default: <Monitor className="h-4 w-4" />,
    dark: <Moon className="h-4 w-4" />,
    light: <Sun className="h-4 w-4" />,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Sistema de Acompanhamento</h1>
            <Badge variant={user?.role === "admin" ? "default" : "secondary"}>
              {user?.role === "admin" ? "Administrador" : "Usuário"}
            </Badge>
            {/* DEBUG: Mostra papel do usuário logado */}
            <span className="text-xs text-orange-600">
              Usuário: {user?.name} | Email: {user?.email} | Papel: {user?.role}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Olá, {user?.name}</span>

            {/* Theme Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  {themeIcons[theme]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("default")}>
                  <Monitor className="mr-2 h-4 w-4" />
                  Padrão
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="mr-2 h-4 w-4" />
                  Escuro
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="mr-2 h-4 w-4" />
                  Claro
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="quadro" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Quadro
            </TabsTrigger>
            <TabsTrigger value="capacitacao" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Capacitação
            </TabsTrigger>
            <TabsTrigger value="treinados" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Treinados
            </TabsTrigger>
            <TabsTrigger value="desligamentos" className="flex items-center gap-2">
              <UserX className="h-4 w-4" />
              Desligamentos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AnalyticsOverview data={analyticsData} />
          </TabsContent>

          <TabsContent value="quadro">
            <QuadroTab />
          </TabsContent>

          <TabsContent value="capacitacao">
            <CapacitacaoTab />
          </TabsContent>

          <TabsContent value="treinados">
            <TreinadosTab />
          </TabsContent>

          <TabsContent value="desligamentos">
            <DesligamentosTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
