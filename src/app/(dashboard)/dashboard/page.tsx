"use client"

import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Building2, Plus, UserCircle, AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  account_status: string;
  tenants?: any[];
}

export default function DashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await api.get('/auth/me'); 
      return response.data;
    },
    // Eğer hata alırsak 1 kere daha denemesin, direkt hataya düşsün
    retry: false, 
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-[250px]" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <Card className="border-destructive m-4">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertCircle /> Oturum Hatası
          </CardTitle>
          <CardDescription>
            Oturumunuzun süresi dolmuş veya veriler alınamıyor. 
            Lütfen çerezleri temizleyip tekrar giriş yapın.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          {/* Kullanıcıyı kurtarmak için manuel çıkış butonu */}
          <Button variant="outline" onClick={() => {
            document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.href = "/login";
          }}>
            Giriş Sayfasına Dön
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // HAYAT KURTARAN KISIM BURASI
  // Backend bazen veriyi direkt 'data' içinde, bazen 'data.user' içinde dönebilir.
  // Boş obje {} vererek undefined hatasının önüne geçiyoruz.
  const user: UserProfile = data.user || data || {};
  const tenants: any[] = data.tenants || user.tenants || [];
  const currentPlan = "Free Plan";

  return (
    <div className="space-y-8">
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-xl border shadow-sm">
        <div className="flex items-center gap-4">
          <UserCircle className="h-16 w-16 text-muted-foreground" />
          <div>
            {/* Soru işaretleri (?) ekledik ki veri yoksa çökmek yerine boş bıraksın */}
            <h1 className="text-2xl font-bold tracking-tight">
              Hoş geldin, {user?.first_name || 'Kullanıcı'}! 👋
            </h1>
            <p className="text-muted-foreground">
              {user?.email || 'E-posta yükleniyor...'} • Durum: <span className="text-green-500 font-medium">{user?.account_status || 'Bilinmiyor'}</span>
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground mb-1">Mevcut Paketiniz</p>
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold transition-colors bg-primary text-primary-foreground">
            {currentPlan}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Şirketlerim (Çalışma Alanları)</h2>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Şirket Kur
          </Button>
        </div>

        {tenants.length === 0 ? (
          <Card className="border-dashed border-2 bg-slate-50/50 dark:bg-slate-900/50">
            <CardContent className="flex flex-col items-center justify-center h-48 text-center space-y-4 pt-6">
              <Building2 className="h-12 w-12 text-muted-foreground" />
              <div>
                <h3 className="font-semibold text-lg">Henüz bir şirkete üye değilsiniz</h3>
                <p className="text-sm text-muted-foreground">İşlem yapabilmek için yeni bir şirket kurun veya bir daveti kabul edin.</p>
              </div>
              <Button variant="outline">Hemen Kur</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tenants.map((tenant: any) => (
              <Card key={tenant.id || Math.random()} className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    {tenant.company_name || 'İsimsiz Şirket'}
                  </CardTitle>
                  <CardDescription>Rolünüz: {tenant.role || 'Bilinmiyor'}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="secondary" className="w-full">Çalışma Alanına Gir</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}