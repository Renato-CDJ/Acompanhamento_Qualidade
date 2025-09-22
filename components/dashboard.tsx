"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { QuadroTab } from "@/components/quadro-tab"
import { TreinamentoTab } from "@/components/treinamento-tab"
import { TreinadosTab } from "@/components/treinados-tab"
import { DesligamentosTab } from "@/components/desligamentos-tab"
import { Building2, LogOut, BarChart3, GraduationCap, Users, UserMinus } from "lucide-react"

interface DashboardProps {
  user: { email: string; role: "admin" | "user" }
  onLogout: () => void
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("quadro")

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Sistema de Acompanhamento</h1>
              <p className="text-xs text-muted-foreground">Dashboard Corporativo</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                {user.role === "admin" ? "Administrador" : "Usuário"}
              </Badge>
              <span className="text-sm text-muted-foreground">{user.email}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="space-y-6"
          key="dashboard-tabs" // Adicionando uma key estável
        >
          <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4">
            <TabsTrigger value="quadro" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Quadro
            </TabsTrigger>
            <TabsTrigger value="treinamento" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Treinamento
            </TabsTrigger>
            <TabsTrigger value="treinados" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Treinados
            </TabsTrigger>
            <TabsTrigger value="desligamentos" className="flex items-center gap-2">
              <UserMinus className="w-4 h-4" />
              Desligamentos
            </TabsTrigger>
          </TabsList>

          {activeTab === "quadro" && (
            <TabsContent value="quadro" className="animate-fade-in">
              <QuadroTab userRole={user.role} />
            </TabsContent>
          )}

          {activeTab === "treinamento" && (
            <TabsContent value="treinamento" className="animate-fade-in">
              <TreinamentoTab userRole={user.role} />
            </TabsContent>
          )}

          {activeTab === "treinados" && (
            <TabsContent value="treinados" className="animate-fade-in">
              <TreinadosTab userRole={user.role} />
            </TabsContent>
          )}

          {activeTab === "desligamentos" && (
            <TabsContent value="desligamentos" className="animate-fade-in">
              <DesligamentosTab userRole={user.role} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}
