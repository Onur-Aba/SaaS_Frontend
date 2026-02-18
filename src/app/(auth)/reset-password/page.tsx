import { ResetPasswordForm } from "@/features/auth/components/reset-password-form"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Yeni Şifre Belirle",
  description: "Hesabınız için yeni ve güvenli bir şifre oluşturun.",
}

export default function ResetPasswordPage() {
// src\app\(auth)\reset-password\page.tsx içindeki return kısmı:
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md bg-card text-card-foreground p-8 rounded-xl shadow-sm border border-border">
        <Suspense fallback={<div className="text-center text-sm text-muted-foreground">Form yükleniyor...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}