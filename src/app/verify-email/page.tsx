// src/app/verify-email/page.tsx
"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { api } from "@/lib/axios"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

// Next.js App Router'da useSearchParams kullanan bileşenler Suspense ile sarmalanmalıdır
function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Güvenlik token'ınız doğrulanıyor, lütfen bekleyin...")

  useEffect(() => {
    // 1. URL'de token yoksa direkt hata ver
    if (!token) {
      setStatus("error")
      setMessage("Doğrulama bağlantısı geçersiz veya token bulunamadı.")
      return
    }

    // 2. Token varsa Backend'e doğrulamaya yolla
    api.post("/auth/verify-email", { token })
      .then(() => {
        setStatus("success")
        setMessage("Hesabınız başarıyla doğrulandı! 5 saniye içinde giriş sayfasına yönlendiriliyorsunuz...")
        
        // 3. Başarılı olursa 5 saniye sonra Login'e yönlendir
        setTimeout(() => {
          router.push("/login")
        }, 5000)
      })
      .catch((error) => {
        setStatus("error")
        // Backend'den gelen özel hata mesajını göster
        setMessage(error.response?.data?.message || "Doğrulama bağlantısı geçersiz veya süresi dolmuş.")
      })
  }, [token, router])

  return (
    <Card className="w-full max-w-md border shadow-lg">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          {status === "loading" && <Loader2 className="h-16 w-16 text-primary animate-spin" />}
          {status === "success" && <CheckCircle2 className="h-16 w-16 text-green-500" />}
          {status === "error" && <XCircle className="h-16 w-16 text-destructive" />}
        </div>
        <CardTitle className="text-2xl font-bold">
          {status === "loading" && "Hesabınız Doğrulanıyor"}
          {status === "success" && "Doğrulama Başarılı!"}
          {status === "error" && "Doğrulama Başarısız"}
        </CardTitle>
        <CardDescription className="text-base mt-2">
          {message}
        </CardDescription>
      </CardHeader>
      
      {/* Eğer hata alırsa manuel giriş butonu çıksın */}
      {status === "error" && (
        <CardContent className="flex justify-center">
          <button 
            onClick={() => router.push('/login')}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Giriş Sayfasına Dön
          </button>
        </CardContent>
      )}
    </Card>
  )
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-background p-4">
      {/* Next.js build hatası vermesin diye Suspense kullanıyoruz */}
      <Suspense fallback={<Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  )
}