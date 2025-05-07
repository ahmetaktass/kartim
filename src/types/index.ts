export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
}

export interface Card {
  id: string;
  userId: string;
  bankName: string;
  cardName: string;
  cardNumber: string;
  fullName: string;
  totalLimit: number;
  availableLimit: number;
  statementDate: number; // 1-31 arası
  dueDate: number; // 1-31 arası
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  cardId: string;
  userId: string;
  amount: number;
  description: string;
  category: string;
  date: Date;
  createdAt: Date;
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'; 