'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Card } from '@/types';

export default function EditCardPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    bankName: '',
    cardName: '',
    cardNumber: '',
    fullName: '',
    totalLimit: '',
    availableLimit: '',
    statementDate: '',
    dueDate: '',
  });

  useEffect(() => {
    fetchCard();
  }, [params.id]);

  const fetchCard = async () => {
    if (!user) return;

    try {
      const cardDoc = await getDoc(doc(db, 'cards', params.id));
      if (!cardDoc.exists()) {
        toast.error('Kart bulunamadı');
        router.push('/cards');
        return;
      }

      const cardData = cardDoc.data() as Card;
      if (cardData.userId !== user.uid) {
        toast.error('Bu kartı düzenleme yetkiniz yok');
        router.push('/cards');
        return;
      }

      setFormData({
        bankName: cardData.bankName,
        cardName: cardData.cardName,
        cardNumber: cardData.cardNumber,
        fullName: cardData.fullName,
        totalLimit: cardData.totalLimit.toString(),
        availableLimit: cardData.availableLimit.toString(),
        statementDate: cardData.statementDate,
        dueDate: cardData.dueDate,
      });
    } catch (error) {
      console.error('Kart yüklenirken hata oluştu:', error);
      toast.error('Kart yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Tarih formatını kontrol et
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/;
    if (!dateRegex.test(formData.statementDate) || !dateRegex.test(formData.dueDate)) {
      toast.error('Tarihler GG.AA.YYYY formatında olmalıdır');
      return;
    }

    setSaving(true);
    try {
      const cardData = {
        ...formData,
        totalLimit: Number(formData.totalLimit),
        availableLimit: Number(formData.availableLimit),
        statementDate: formData.statementDate,
        dueDate: formData.dueDate,
        updatedAt: new Date(),
      };

      await updateDoc(doc(db, 'cards', params.id), cardData);
      toast.success('Kart başarıyla güncellendi');
      router.push('/cards');
    } catch (error) {
      console.error('Kart güncellenirken hata oluştu:', error);
      toast.error('Kart güncellenirken bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-primary">Kart Düzenle</h1>
            <Link
              href="/cards"
              className="text-text hover:text-primary"
            >
              ← Kartlara Dön
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="bankName" className="block text-sm font-medium text-text mb-1">
                  Banka Adı
                </label>
                <input
                  type="text"
                  id="bankName"
                  name="bankName"
                  required
                  value={formData.bankName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="cardName" className="block text-sm font-medium text-text mb-1">
                  Kart Adı
                </label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  required
                  value={formData.cardName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-text mb-1">
                  Kart Numarası
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  required
                  maxLength={16}
                  value={formData.cardNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-text mb-1">
                  Kart Sahibi
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="totalLimit" className="block text-sm font-medium text-text mb-1">
                  Toplam Limit
                </label>
                <input
                  type="number"
                  id="totalLimit"
                  name="totalLimit"
                  required
                  min="0"
                  value={formData.totalLimit}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="availableLimit" className="block text-sm font-medium text-text mb-1">
                  Kullanılabilir Limit
                </label>
                <input
                  type="number"
                  id="availableLimit"
                  name="availableLimit"
                  required
                  min="0"
                  value={formData.availableLimit}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="statementDate" className="block text-sm font-medium text-text mb-1">
                  Hesap Kesim Tarihi (GG.AA.YYYY)
                </label>
                <input
                  type="text"
                  id="statementDate"
                  name="statementDate"
                  required
                  placeholder="01.01.2024"
                  value={formData.statementDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-text mb-1">
                  Son Ödeme Tarihi (GG.AA.YYYY)
                </label>
                <input
                  type="text"
                  id="dueDate"
                  name="dueDate"
                  required
                  placeholder="15.01.2024"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Link
                href="/cards"
                className="px-4 py-2 border border-gray-300 rounded-md text-text hover:bg-gray-50"
              >
                İptal
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 disabled:opacity-50"
              >
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
} 