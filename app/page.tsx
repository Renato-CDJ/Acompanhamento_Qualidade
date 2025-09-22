"use client"

import { useState, useEffect } from "react"
import { LoginForm } from "@/components/login-form"
import { Dashboard } from "@/components/dashboard"

export default function Home() {
  const [user, setUser] = useState<{ email: string; role: "admin" | "user" } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (email: string, password: string) => {
    const users = [
      { email: "admin@empresa.com", password: "admin123", role: "admin" as const },
      { email: "user@empresa.com", password: "user123", role: "user" as const },
    ]

    const foundUser = users.find((u) => u.email === email && u.password === password)
    if (foundUser) {
      const userData = { email: foundUser.email, role: foundUser.role }
      setUser(userData)
      localStorage.setItem("currentUser", JSON.stringify(userData))
      return true
    }
    return false
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {user ? <Dashboard user={user} onLogout={handleLogout} /> : <LoginForm onLogin={handleLogin} />}
    </main>
  )
}
