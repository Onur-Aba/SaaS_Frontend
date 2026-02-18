// src/app/(dashboard)/layout.tsx
"use client"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/shared/mode-toggle"
import { deleteCookie } from "cookies-next"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LogOut, LayoutDashboard } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const handleLogout = () => {
    deleteCookie("accessToken")
    deleteCookie("refreshToken")
    router.push("/login")
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-background">
      {/* Dashboard Özel Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            <Link href="/dashboard">SaaS Panel</Link>
          </div>
          
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Çıkış Yap
            </Button>
          </div>
        </div>
      </header>

      {/* Ana İçerik */}
      <main className="flex-1 container py-8">
        {children}
      </main>
    </div>
  )
}