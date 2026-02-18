// src/components/layout/navbar.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/shared/mode-toggle';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              SaaS Platform
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Arama çubuğu vb. buraya gelebilir */}
          </div>
          <nav className="flex items-center gap-2">
            <ModeToggle />
            <Link href="/login">
              <Button variant="ghost">Giriş Yap</Button>
            </Link>
            <Link href="/register">
              <Button>Kayıt Ol</Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}