export interface Transaction {
  id: string;
  type: 'daromad' | 'xarajat';
  amount: number;
  categoryId: string;
  description: string;
  date: any; // Firestore Timestamp
  userId: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  type: 'daromad' | 'xarajat';
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  balance: number;
  createdAt: any;
}
