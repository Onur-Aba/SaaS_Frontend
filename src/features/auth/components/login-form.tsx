"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/axios"
import { setCookie, getCookie } from "cookies-next"
import { useRouter, useSearchParams } from "next/navigation" 
import Link from "next/link" // YENİ: Link importu eklendi
import { toast } from "sonner"
import { useState, useRef, useEffect } from "react"
import ReCAPTCHA from "react-google-recaptcha"
// YENİ: Göz ikonları eklendi
import { Eye, EyeOff } from "lucide-react"

const formSchema = z.object({
  identifier: z.string().min(1, "E-posta veya kullanıcı adı gerekli"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
})

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams() 
  const [isLoading, setIsLoading] = useState(false)
  // YENİ: Şifre görünürlüğü için state eklendi
  const [showPassword, setShowPassword] = useState(false)
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  const defaultUser = searchParams.get("user") || ""

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { identifier: defaultUser, password: "" }, 
  })

  useEffect(() => {
    if (!defaultUser) {
      const savedUsername = getCookie("lastUsername") as string;
      if (savedUsername) {
        form.setValue("identifier", savedUsername);
      }
    }
  }, [defaultUser, form]);

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    await attemptLogin(values); 
  }

  const attemptLogin = async (values: z.infer<typeof formSchema>, token?: string) => {
    try {
      const payload = token ? { ...values, recaptchaToken: token } : values;
      
      const { data } = await api.post("/auth/login", payload);
      
      setCookie("accessToken", data.accessToken, { maxAge: 60 * 60 * 24 * 7 })
      setCookie("refreshToken", data.refreshToken)
      setCookie("lastUsername", values.identifier, { maxAge: 60 * 60 * 24 * 30 })

      toast.success("Giriş başarılı!")
      router.push("/dashboard")

    } catch (error: any) {
      const errorData = error.response?.data;

      if (error.response?.status === 403 && errorData?.code === 'CAPTCHA_REQUIRED') {
          toast.warning("Şüpheli işlem algılandı. Lütfen güvenlik doğrulamasını tamamlayın.");
          
          const newToken = await recaptchaRef.current?.executeAsync();
          
          if (newToken) {
              await attemptLogin(values, newToken);
          } else {
              setIsLoading(false);
          }
          return; 
      }

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
              <FormControl>
                <Input placeholder="kullanici123" {...field} />
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
              {/* GÜNCELLENDİ: Şifre etiketi ve Şifremi Unuttum linki aynı satıra alındı */}
              <div className="flex items-center justify-between">
                <FormLabel>Şifre</FormLabel>
                <Link 
                  href="/forgot-password" 
                  className="text-sm font-medium text-muted-foreground hover:text-primary hover:underline"
                  tabIndex={-1}
                >
                  Şifremi Unuttum
                </Link>
              </div>
              <FormControl>
                {/* GÜNCELLENDİ: Input'u sarmalayan relative div ve toggle butonu */}
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="******" 
                    {...field} 
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground"
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1} // Tab tuşuyla gezinirken butona odaklanmayı engeller (UX için iyi bir detay)
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                    </span>
                  </Button>
                </div>
              </FormControl>
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