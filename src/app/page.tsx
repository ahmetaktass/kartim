import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-primary">
          Kartim
        </h1>
        <p className="text-xl text-text">
          Kredi kartlarınızı akıllıca yönetin
        </p>
        <div className="space-x-4">
          <Link 
            href="/auth/login" 
            className="inline-block bg-primary text-text px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all"
          >
            Giriş Yap
          </Link>
          <Link 
            href="/auth/register" 
            className="inline-block bg-secondary text-text px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all"
          >
            Kayıt Ol
          </Link>
        </div>
      </div>
    </main>
  );
}
