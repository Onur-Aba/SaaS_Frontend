// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { cn } from '@/lib/utils';

// DÜZELTİLDİ: Yollar dosyaların gerçek konumuna (features klasörüne) göre ayarlandı
import { Header } from "@/features/auth/components/layout/header";
import { Footer } from "@/features/auth/components/layout/footer";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SaaS Platform',
  description: 'Profesyonel İş Yönetim Platformu',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen bg-background antialiased")}>
        <Providers>
          {/* Ana iskelet flex ve min-h-screen ile oluşturuldu */}
          <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Header />
            {/* Sayfalar (children) bu main etiketinin içinde render edilecek */}
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}