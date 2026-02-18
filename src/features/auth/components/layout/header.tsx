"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { getCookie } from "cookies-next"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Moon, Sun } from "lucide-react"

export function Header() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Hydration hatasını önlemek için (Next.js'in client/server uyumsuzluğunu çözer)
  // ve kullanıcının giriş yapıp yapmadığını çerezden (accessToken) kontrol etmek için:
  useEffect(() => {
    setMounted(true)
    const token = getCookie("accessToken")
    setIsLoggedIn(!!token)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-7xl mx-auto items-center justify-between px-4 sm:px-8">
        
        {/* Sol Kısım: Geri Butonu */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()} 
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Geri</span>
        </Button>

        {/* Sağ Kısım: Tema Değiştirici ve Auth Butonları */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Tema Değiştirici */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-muted-foreground hover:text-foreground"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Tema değiştir</span>
            </Button>
          )}

          {/* Oturum Durumuna Göre Butonlar */}
          {mounted && (
            isLoggedIn ? (
              <Button asChild size="sm">
                <Link href="/profile">Profilim</Link>
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
                  <Link href="/auth/login">Giriş Yap</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/auth/register">Kayıt Ol</Link>
                </Button>
              </div>
            )
          )}
        </div>
      </div>
    </header>
  )
}