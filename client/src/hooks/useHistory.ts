import { useState, useEffect, useCallback } from 'react';
import { ManhwaListItem } from '@shared/types';
import { useAuth } from './authProvider';
import { db } from '@/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const HISTORY_KEY = 'manhwa-history';

export const useHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<ManhwaListItem[]>([]);

  const getHistoryFromFirestore = useCallback(async (userId: string) => {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data().history || [];
    }
    return [];
  }, []);

  useEffect(() => {
    if (user) {
      getHistoryFromFirestore(user.uid).then(setHistory);
    } else {
      try {
        const storedHistory = localStorage.getItem(HISTORY_KEY);
        if (storedHistory) {
          setHistory(JSON.parse(storedHistory));
        }
      } catch (error) {
        console.error('Error reading history from localStorage', error);
      }
    }
  }, [user, getHistoryFromFirestore]);

  const addToHistory = useCallback(async (manhwa: ManhwaListItem) => {
    const newHistory = [manhwa, ...history.filter(item => item.id !== manhwa.id)];
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { history: newHistory }, { merge: true });
    } else {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    }
    setHistory(newHistory);
  }, [user, history]);

  return { history, addToHistory };
};
