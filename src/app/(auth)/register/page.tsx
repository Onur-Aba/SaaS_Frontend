// src/app/(auth)/register/page.tsx
import { RegisterForm } from "@/features/auth/components/register-form"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Hesap Oluştur</h1>
          <p className="text-sm text-muted-foreground">
            Hemen kayıt olun ve şirketinizi kurun
          </p>
        </div>

        <RegisterForm />

        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link href="/login" className="hover:text-brand underline underline-offset-4">
            Zaten hesabın var mı? Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  )
}