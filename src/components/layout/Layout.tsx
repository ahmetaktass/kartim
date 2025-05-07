'use client';

import Navigation from './Navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { usePathname } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { status, user } = useAuth();
  const pathname = usePathname();

  // Auth sayfalarında navigasyonu gösterme
  if (status === 'unauthenticated' || pathname.startsWith('/auth')) {
    return <>{children}</>;
  }

  // Kullanıcı giriş yapmamışsa ve auth sayfasında değilse, auth sayfasına yönlendir
  if (!user && !pathname.startsWith('/auth')) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-4">{children}</main>
    </div>
  );
} 