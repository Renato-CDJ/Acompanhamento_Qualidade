"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
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
  const [key, setKey] = useState(0) // Chave para forçar remontagem

  // Função para mudar a aba e forçar remontagem
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setKey(prevKey => prevKey + 1);
  };

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
        <div className="space-y-6">
          {/* Navegação personalizada */}
          <div className="bg-muted inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px] grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4">
            <button 
              onClick={() => handleTabChange("quadro")}
              className={`inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border px-2 py-1 text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === "quadro" 
                  ? "bg-background border-input shadow-sm" 
                  : "border-transparent"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Quadro
            </button>
            <button 
              onClick={() => handleTabChange("treinamento")}
              className={`inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border px-2 py-1 text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === "treinamento" 
                  ? "bg-background border-input shadow-sm" 
                  : "border-transparent"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Treinamento
            </button>
            <button 
              onClick={() => handleTabChange("treinados")}
              className={`inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border px-2 py-1 text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === "treinados" 
                  ? "bg-background border-input shadow-sm" 
                  : "border-transparent"
              }`}
            >
              <Users className="w-4 h-4" />
              Treinados
            </button>
            <button 
              onClick={() => handleTabChange("desligamentos")}
              className={`inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border px-2 py-1 text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === "desligamentos" 
                  ? "bg-background border-input shadow-sm" 
                  : "border-transparent"
              }`}
            >
              <UserMinus className="w-4 h-4" />
              Desligamentos
            </button>
          </div>

          {/* Conteúdo com chave para forçar remontagem */}
          <div key={key} className="animate-fade-in">
            {activeTab === "quadro" && <QuadroTab userRole={user.role} />}
            {activeTab === "treinamento" && <TreinamentoTab userRole={user.role} />}
            {activeTab === "treinados" && <TreinadosTab userRole={user.role} />}
            {activeTab === "desligamentos" && <DesligamentosTab userRole={user.role} />}
          </div>
        </div>
      </div>
    </div>
  )
}
