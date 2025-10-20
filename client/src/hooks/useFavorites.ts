import { useState, useEffect, useCallback } from 'react';
import { ManhwaListItem } from '@shared/types';
import { useAuth } from './authProvider';
import { db } from '@/firebaseConfig';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

const FAVORITES_KEY = 'manhwa-favorites';

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<ManhwaListItem[]>([]);

  const getFavoritesFromFirestore = useCallback(async (userId: string) => {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data().favorites || [];
    }
    return [];
  }, []);

  useEffect(() => {
    if (user) {
      getFavoritesFromFirestore(user.uid).then(setFavorites);
    } else {
      try {
        const storedFavorites = localStorage.getItem(FAVORITES_KEY);
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Error reading favorites from localStorage', error);
      }
    }
  }, [user, getFavoritesFromFirestore]);

  const addFavorite = useCallback(async (manhwa: ManhwaListItem) => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        favorites: arrayUnion(manhwa)
      });
    } else {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites, manhwa]));
    }
    setFavorites(prev => [...prev, manhwa]);
  }, [user, favorites]);

  const removeFavorite = useCallback(async (manhwaId: string) => {
    const manhwaToRemove = favorites.find(fav => fav.id === manhwaId);
    if (!manhwaToRemove) return;

    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        favorites: arrayRemove(manhwaToRemove)
      });
    } else {
      const newFavorites = favorites.filter(fav => fav.id !== manhwaId);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    }
    setFavorites(prev => prev.filter(fav => fav.id !== manhwaId));
  }, [user, favorites]);

  const isFavorite = useCallback((manhwaId: string) => {
    return favorites.some(fav => fav.id === manhwaId);
  }, [favorites]);

  return { favorites, addFavorite, removeFavorite, isFavorite };
};
