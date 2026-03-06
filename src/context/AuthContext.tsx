import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signOut, deleteUser } from 'firebase/auth';
import { doc, onSnapshot, setDoc, getDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

interface AuthContextType {
  user: User | null;
  userData: any | null;
  loading: boolean;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  userData: null, 
  loading: true,
  logout: async () => {},
  deleteAccount: async () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const deleteAccount = async () => {
    if (!user) return;
    try {
      // Delete from Firestore first
      await deleteDoc(doc(db, 'users', user.uid));
      // Then delete the auth user
      await deleteUser(user);
    } catch (error) {
      console.error("Delete account error:", error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser);
      
      if (authUser) {
        const userRef = doc(db, 'users', authUser.uid);
        
        try {
          // Check if user document exists, create if not
          const userSnap = await getDoc(userRef);
          
          if (!userSnap.exists()) {
            await setDoc(userRef, {
              uid: authUser.uid,
              email: authUser.email,
              displayName: authUser.displayName || 'Foydalanuvchi',
              balance: 0,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
          }
        } catch (err) {
          console.warn("Initial Firestore check failed (might be offline):", err);
        }

        const unsubscribeDoc = onSnapshot(userRef, (userDoc) => {
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
          setLoading(false);
        }, (error) => {
          console.error("Firestore user data error:", error);
          setLoading(false);
        });
        
        return () => unsubscribeDoc();
      } else {
        setUserData(null);
        setLoading(false);
      }
    });
    
    return () => unsubscribeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading, logout, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
