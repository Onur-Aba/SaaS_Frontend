// src/proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// FONKSİYON ADI 'proxy' OLARAK DEĞİŞTİ
export function proxy(request: NextRequest) { 
  // Cookie'den token'ı al
  const token = request.cookies.get('accessToken')?.value

  // Eğer kullanıcı /dashboard veya altındaki bir rotaya gitmek istiyorsa
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      // Token yoksa login'e yönlendir
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Eğer kullanıcı ZATEN giriş yapmışsa ve login/register sayfalarına gitmeye çalışıyorsa
  if (token && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
    // Onu direkt dashboard'a geri gönder
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// Config ayarları aynı kalıyor
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
}