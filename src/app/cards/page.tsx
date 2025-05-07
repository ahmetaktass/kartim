'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card } from '@/types';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CardsPage() {
  const { user } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCards();
  }, [user]);

  const fetchCards = async () => {
    if (!user) return;
    
    try {
      const cardsQuery = query(
        collection(db, 'cards'),
        where('userId', '==', user.uid)
      );
      
      const querySnapshot = await getDocs(cardsQuery);
      const cardsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Card[];
      
      setCards(cardsData);
    } catch (error) {
      console.error('Kartlar yüklenirken hata oluştu:', error);
      toast.error('Kartlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!confirm('Bu kartı silmek istediğinizden emin misiniz?')) return;

    try {
      await deleteDoc(doc(db, 'cards', cardId));
      setCards(cards.filter(card => card.id !== cardId));
      toast.success('Kart başarıyla silindi');
    } catch (error) {
      console.error('Kart silinirken hata oluştu:', error);
      toast.error('Kart silinirken bir hata oluştu');
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-primary">Kartlarım</h1>
            <Link
              href="/cards/new"
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all"
            >
              Yeni Kart Ekle
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : cards.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <p className="text-text mb-4">Henüz kart eklenmemiş.</p>
              <Link
                href="/cards/new"
                className="inline-block bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all"
              >
                İlk Kartınızı Ekleyin
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card) => (
                <div key={card.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-primary">{card.bankName}</h3>
                    <div className="flex space-x-2">
                      <Link
                        href={`/cards/${card.id}/edit`}
                        className="text-secondary hover:text-opacity-80"
                      >
                        Düzenle
                      </Link>
                      <button
                        onClick={() => handleDeleteCard(card.id)}
                        className="text-error hover:text-opacity-80"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-text">
                      <span className="font-medium">Kart Adı:</span> {card.cardName}
                    </p>
                    <p className="text-text">
                      <span className="font-medium">Kart No:</span> **** **** **** {card.cardNumber.slice(-4)}
                    </p>
                    <p className="text-text">
                      <span className="font-medium">Kart Sahibi:</span> {card.fullName}
                    </p>
                    <p className="text-text">
                      <span className="font-medium">Toplam Limit:</span>{' '}
                      {card.totalLimit.toLocaleString('tr-TR')} ₺
                    </p>
                    <p className="text-text">
                      <span className="font-medium">Kullanılabilir Limit:</span>{' '}
                      {card.availableLimit.toLocaleString('tr-TR')} ₺
                    </p>
                    <p className="text-text">
                      <span className="font-medium">Hesap Kesim Tarihi:</span> {card.statementDate}
                    </p>
                    <p className="text-text">
                      <span className="font-medium">Son Ödeme Tarihi:</span> {card.dueDate}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <Link
                      href={`/cards/${card.id}`}
                      className="text-primary hover:text-opacity-80 font-medium"
                    >
                      Detayları Görüntüle →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
} 