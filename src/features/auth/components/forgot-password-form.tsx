"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/axios"
import { toast } from "sonner"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

const formSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
})

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      await api.post("/auth/forgot-password", values)
      setIsSubmitted(true)
      toast.success("Şifre sıfırlama bağlantısı gönderildi!")
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center space-y-4">
        <h3 className="text-lg font-medium">E-postanızı Kontrol Edin</h3>
        <p className="text-sm text-muted-foreground">
          Eğer sistemimizde kayıtlı bir hesabınız varsa, şifre sıfırlama bağlantısını gönderdik.
        </p>
        <Button asChild variant="outline" className="w-full mt-4">
          <Link href="/login">Giriş Sayfasına Dön</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/login" className="text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h2 className="text-xl font-semibold">Şifremi Unuttum</h2>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Hesabınıza bağlı e-posta adresini girin, size şifrenizi sıfırlamanız için bir bağlantı gönderelim.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-posta</FormLabel>
                <FormControl>
                  <Input placeholder="ornek@sirket.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
          </Button>
        </form>
      </Form>
    </div>
  )
}