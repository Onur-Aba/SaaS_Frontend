import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Şifremi Unuttum",
  description: "Hesabınızın şifresini sıfırlamak için e-posta adresinizi girin.",
}

export default function ForgotPasswordPage() {
  return (
    // bg-slate-50 yerine bg-background (veya daha hafif bir ton için bg-muted/40) kullandık
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      {/* bg-white yerine bg-card
        border-slate-100 yerine border-border
        Yazı renklerinin uyumu için text-card-foreground eklendi 
      */}
      <div className="w-full max-w-md bg-card text-card-foreground p-8 rounded-xl shadow-sm border border-border">
        <ForgotPasswordForm />
      </div>
    </div>
  )
}