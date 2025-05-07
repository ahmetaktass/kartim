'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card } from '@/types';

export default function DashboardPage() {
  const { user } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [user]);

  const totalLimit = cards.reduce((sum, card) => sum + card.totalLimit, 0);
  const availableLimit = cards.reduce((sum, card) => sum + card.availableLimit, 0);
  const totalDebt = totalLimit - availableLimit;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-primary mb-8">Dashboard</h1>
          
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-medium text-text mb-2">Toplam Limit</h3>
                <p className="text-2xl font-bold text-primary">
                  {totalLimit.toLocaleString('tr-TR')} ₺
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-medium text-text mb-2">Kullanılabilir Limit</h3>
                <p className="text-2xl font-bold text-success">
                  {availableLimit.toLocaleString('tr-TR')} ₺
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-medium text-text mb-2">Toplam Borç</h3>
                <p className="text-2xl font-bold text-error">
                  {totalDebt.toLocaleString('tr-TR')} ₺
                </p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-primary mb-4">Kartlarım</h2>
            {cards.length === 0 ? (
              <p className="text-text">Henüz kart eklenmemiş.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map((card) => (
                  <div key={card.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-medium text-lg mb-2">{card.bankName}</h3>
                    <p className="text-sm text-text mb-1">Kart No: **** **** **** {card.cardNumber.slice(-4)}</p>
                    <p className="text-sm text-text mb-1">Limit: {card.totalLimit.toLocaleString('tr-TR')} ₺</p>
                    <p className="text-sm text-text">Kullanılabilir: {card.availableLimit.toLocaleString('tr-TR')} ₺</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 