'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { tr } from 'date-fns/locale';

const POPULAR_BANKS = [
  'Garanti BBVA',
  'İş Bankası',
  'Akbank',
  'Yapı Kredi',
  'Ziraat Bankası',
  'Halkbank',
  'Vakıfbank',
  'QNB Finansbank',
  'ING Bank',
  'HSBC',
  'Denizbank',
  'TEB',
  'Şekerbank',
  'Anadolubank',
  'Odeabank',
  'Albaraka Türk',
  'Kuveyt Türk',
  'Vakıf Katılım',
  'Ziraat Katılım',
  'Türkiye Finans'
];

export default function NewCardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bankName: '',
    cardName: '',
    cardNumber: '',
    fullName: '',
    totalLimit: '',
    availableLimit: '',
    statementDate: null as Date | null,
    dueDate: null as Date | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date: Date | null, name: 'statementDate' | 'dueDate') => {
    setFormData(prev => ({
      ...prev,
      [name]: date
    }));
  };

  const formatCurrency = (value: string) => {
    // Sadece sayıları al
    const numbers = value.replace(/[^\d]/g, '');
    // Sayıyı formatla
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formattedValue = formatCurrency(value);
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.statementDate || !formData.dueDate) {
      toast.error('Lütfen tarihleri seçin');
      return;
    }

    setLoading(true);
    try {
      // Firestore'a gönderilecek veriyi hazırla
      const cardData = {
        bankName: formData.bankName,
        cardName: formData.cardName,
        cardNumber: formData.cardNumber,
        fullName: formData.fullName,
        totalLimit: Number(formData.totalLimit.replace(/\./g, '')),
        availableLimit: Number(formData.availableLimit.replace(/\./g, '')),
        statementDate: formData.statementDate.toLocaleDateString('tr-TR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
        dueDate: formData.dueDate.toLocaleDateString('tr-TR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
        userId: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Firestore'a veriyi gönder
      const docRef = await addDoc(collection(db, 'cards'), cardData);
      console.log('Kart eklendi, ID:', docRef.id);
      
      toast.success('Kart başarıyla eklendi');
      router.push('/cards');
    } catch (error) {
      console.error('Kart eklenirken hata oluştu:', error);
      toast.error('Kart eklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-primary">Yeni Kart Ekle</h1>
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
                <select
                  id="bankName"
                  name="bankName"
                  required
                  value={formData.bankName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="">Banka Seçin</option>
                  {POPULAR_BANKS.map((bank) => (
                    <option key={bank} value={bank}>
                      {bank}
                    </option>
                  ))}
                </select>
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
                <div className="relative">
                  <input
                    type="text"
                    id="totalLimit"
                    name="totalLimit"
                    required
                    value={formData.totalLimit}
                    onChange={handleCurrencyChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  />
                  <span className="absolute right-3 top-2 text-gray-500">TL</span>
                </div>
              </div>

              <div>
                <label htmlFor="availableLimit" className="block text-sm font-medium text-text mb-1">
                  Kullanılabilir Limit
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="availableLimit"
                    name="availableLimit"
                    required
                    value={formData.availableLimit}
                    onChange={handleCurrencyChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  />
                  <span className="absolute right-3 top-2 text-gray-500">TL</span>
                </div>
              </div>

              <div>
                <label htmlFor="statementDate" className="block text-sm font-medium text-text mb-1">
                  Hesap Kesim Tarihi
                </label>
                <DatePicker
                  selected={formData.statementDate}
                  onChange={(date: Date | null) => handleDateChange(date, 'statementDate')}
                  dateFormat="dd.MM.yyyy"
                  locale={tr}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  placeholderText="GG.AA.YYYY"
                  required
                />
              </div>

              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-text mb-1">
                  Son Ödeme Tarihi
                </label>
                <DatePicker
                  selected={formData.dueDate}
                  onChange={(date: Date | null) => handleDateChange(date, 'dueDate')}
                  dateFormat="dd.MM.yyyy"
                  locale={tr}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  placeholderText="GG.AA.YYYY"
                  required
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
                disabled={loading}
                className="px-4 py-2 bg-primary text-text rounded-md hover:bg-opacity-90 disabled:opacity-50 font-medium"
              >
                {loading ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
} 