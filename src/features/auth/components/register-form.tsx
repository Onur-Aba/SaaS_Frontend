"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/axios"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState, useRef } from "react"
import ReCAPTCHA from "react-google-recaptcha"

// Zod Şeması
const formSchema = z.object({
  first_name: z.string().min(2, "Ad en az 2 karakter olmalı"),
  last_name: z.string().min(2, "Soyad en az 2 karakter olmalı"),
  username: z.string().min(3, "Kullanıcı adı en az 3 karakter olmalı"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz."),
  password: z.string()
    .min(8, "Şifre en az 8 karakter olmalıdır.")
    .max(32, "Şifre çok uzun.")
    .regex(
      /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
      "Şifre en az 1 büyük harf, 1 küçük harf ve 1 rakam içermelidir."
    ),
})

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
      first_name: "", 
      last_name: "", 
      username: "", 
      email: "", 
      password: "" 
    },
  })

  // 1. Kullanıcı Butona Bastığında (Captcha YOK)
  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    await attemptRegister(values); // Doğrudan kayıt deniyoruz
  }

  // 2. Asıl İstek Fonksiyonu (Dinamik)
  const attemptRegister = async (values: z.infer<typeof formSchema>, token?: string) => {
    try {
      // Token varsa payload'a ekle, yoksa sadece bilgileri yolla
      const payload = token ? { ...values, recaptchaToken: token } : values;

      await api.post("/auth/register", payload);
      
      toast.success("Hesap başarıyla oluşturuldu! Şimdi giriş yapabilirsiniz.")
      router.push(`/login?user=${values.username}`)

    } catch (error: any) {
      const errorData = error.response?.data;

      // 3. EĞER BACKEND "BANA CAPTCHA LAZIM" DERSE:
      if (error.response?.status === 403 && errorData?.code === 'CAPTCHA_REQUIRED') {
          toast.warning("Şüpheli işlem algılandı. Lütfen güvenlik doğrulamasını tamamlayın.");
          
          // Captcha'yı ŞİMDİ tetikliyoruz!
          const newToken = await recaptchaRef.current?.executeAsync();
          
          if (newToken) {
              // Kullanıcı çözdüyse, aynı işlemi token ile baştan yap:
              await attemptRegister(values, newToken);
          } else {
              // Kullanıcı pencereyi kapattıysa yükleniyor ikonunu durdur
              setIsLoading(false);
          }
          return; // İlk hata döngüsünü durdur, aşağıya geçmesin
      }

      // Backend'den gelen standart hatalar (Email kullanılıyor vs.)
      recaptchaRef.current?.reset(); 
      toast.error(errorData?.message || "Kayıt işlemi başarısız oldu.")
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ad</FormLabel>
                <FormControl>
                  <Input placeholder="Adınız" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Soyad</FormLabel>
                <FormControl>
                  <Input placeholder="Soyadınız" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kullanıcı Adı</FormLabel>
              <FormControl>
                <Input placeholder="kullanici123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Şifre</FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Görünmez Captcha */}
        <ReCAPTCHA
            ref={recaptchaRef}
            size="invisible" 
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Kaydediliyor..." : "Kayıt Ol"}
        </Button>
      </form>
      
      <p className="text-xs text-center text-muted-foreground mt-4">
        This site is protected by reCAPTCHA and the Google
        <a href="https://policies.google.com/privacy" className="underline ml-1">Privacy Policy</a> and
        <a href="https://policies.google.com/terms" className="underline ml-1">Terms of Service</a> apply.
      </p>
    </Form>
  )
}