"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/axios"
import { setCookie } from "cookies-next"
// YENİ: useSearchParams eklendi
import { useRouter, useSearchParams } from "next/navigation" 
import { toast } from "sonner"
import { useState, useRef } from "react"
import ReCAPTCHA from "react-google-recaptcha"

const formSchema = z.object({
  identifier: z.string().min(1, "E-posta veya kullanıcı adı gerekli"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
})

export function LoginForm() {
  const router = useRouter()
  // YENİ: URL parametrelerini okumak için eklendi
  const searchParams = useSearchParams() 
  const [isLoading, setIsLoading] = useState(false)
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  // YENİ: URL'den 'user' parametresini çek (yoksa boş string)
  const defaultUser = searchParams.get("user") || ""

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // GÜNCELLENDİ: identifier alanına URL'den gelen veri varsayılan olarak atandı
    defaultValues: { identifier: defaultUser, password: "" }, 
  })

  // 1. Kullanıcı Butona Bastığında (Captcha YOK)
  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    await attemptLogin(values); // Doğrudan giriş deniyoruz
  }

  // 2. Asıl İstek Fonksiyonu (Dinamik)
  const attemptLogin = async (values: z.infer<typeof formSchema>, token?: string) => {
    try {
      // Token varsa payload'a ekle, yoksa sadece bilgileri yolla
      // Not: Backend'de "recaptcha" olarak güncellediysen buradaki recaptchaToken key'ini de ona göre "recaptcha: token" yapman gerekebilir. 
      // Mevcut koduna dokunmadım.
      const payload = token ? { ...values, recaptchaToken: token } : values;
      
      const { data } = await api.post("/auth/login", payload);
      
      setCookie("accessToken", data.accessToken, { maxAge: 60 * 60 * 24 * 7 })
      setCookie("refreshToken", data.refreshToken)
      
      toast.success("Giriş başarılı!")
      router.push("/dashboard")

    } catch (error: any) {
      const errorData = error.response?.data;

      // 3. EĞER BACKEND "BANA CAPTCHA LAZIM" DERSE:
      if (error.response?.status === 403 && errorData?.code === 'CAPTCHA_REQUIRED') {
          toast.warning("Şüpheli işlem algılandı. Lütfen güvenlik doğrulamasını tamamlayın.");
          
          // Captcha'yı ŞİMDİ tetikliyoruz!
          const newToken = await recaptchaRef.current?.executeAsync();
          
          if (newToken) {
              // Kullanıcı çözdüyse, aynı işlemi token ile baştan yap:
              await attemptLogin(values, newToken);
          } else {
              setIsLoading(false);
          }
          return; // İlk hata döngüsünü durdur
      }

      // Backend'den gelen standart hatalar (Şifre yanlış vs.)
      recaptchaRef.current?.reset(); 
      toast.error(errorData?.message || "Giriş yapılamadı");
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-posta veya Kullanıcı Adı</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Şifre</FormLabel>
              <FormControl><Input type="password" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ReCAPTCHA
            ref={recaptchaRef}
            size="invisible" 
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
        </Button>
      </form>
    </Form>
  )
}