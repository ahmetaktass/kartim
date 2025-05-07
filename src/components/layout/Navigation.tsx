'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Navigation() {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success('Çıkış yapıldı');
      router.push('/');
    } catch (error) {
      toast.error('Çıkış yapılırken bir hata oluştu');
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-primary">Kartim</span>
            </Link>
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/dashboard')
                    ? 'text-primary'
                    : 'text-text hover:text-primary'
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/cards"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/cards')
                    ? 'text-primary'
                    : 'text-text hover:text-primary'
                }`}
              >
                Kartlar
              </Link>
              {isActive('/cards') && (
                <Link
                  href="/cards/new"
                  className="px-3 py-2 rounded-md text-sm font-medium text-text hover:text-primary"
                >
                  Yeni Kart Ekle
                </Link>
              )}
              <Link
                href="/transactions"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/transactions')
                    ? 'text-primary'
                    : 'text-text hover:text-primary'
                }`}
              >
                İşlemler
              </Link>
              <Link
                href="/profile"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/profile')
                    ? 'text-primary'
                    : 'text-text hover:text-primary'
                }`}
              >
                Profil
              </Link>
              <button
                onClick={handleSignOut}
                className="px-3 py-2 rounded-md text-sm font-medium text-error hover:bg-error hover:bg-opacity-10"
              >
                Çıkış Yap
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 