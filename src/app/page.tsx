import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  // Bu planları normalde backend'den çekeceğiz.
  const plans = [
    { name: 'Free', price: '$0', features: ['1 Kullanıcı', '100MB Depolama', 'Temel Özellikler'] },
    { name: 'Pro', price: '$20', features: ['5 Kullanıcı', '1GB Depolama', 'Gelişmiş Analitik'] },
    { name: 'Enterprise', price: 'Özel', features: ['Sınırsız Kullanıcı', '10GB Depolama', '7/24 Destek'] },
  ];

  return (
    // Navbar kalktı, layout.tsx içindeki Header bu sayfanın üstünde otomatik görünecek.
    <div className="flex flex-col"> 
      
      {/* Hero Section */}
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center mx-auto px-4">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
            İşinizi Yönetmenin <br className="hidden sm:inline" />
            <span className="text-primary">En Profesyonel Yolu</span>
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Çoklu şirket yapısı, rol tabanlı yetkilendirme ve gelişmiş raporlama ile
            SaaS deneyiminizi bir üst seviyeye taşıyın.
          </p>
          <div className="space-x-4">
            {/* Linkler /auth/ dizinine yönlendirildi */}
            <Link href="/auth/register">
              <Button size="lg">Hemen Başla</Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline">Giriş Yap</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto py-8 md:py-12 lg:py-24 bg-slate-50 dark:bg-slate-900/50 rounded-3xl mb-8 px-4">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center mb-10">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl font-bold">
            Planlar
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            İhtiyacınıza en uygun paketi seçin ve hemen başlayın.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card key={plan.name} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>Aylık {plan.price}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 flex-1">
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {/* Buradaki link de /auth/register olarak güncellendi */}
                <Link href="/auth/register" className="w-full">
                  <Button className="w-full">Seç</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}