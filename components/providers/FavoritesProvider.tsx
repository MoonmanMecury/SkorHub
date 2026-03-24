'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getFavoritesAction, toggleFavoriteAction } from '@/app/actions/favorites';

const STORAGE_KEY = '9streams_favorites_v3';

interface FavoritesContextType {
    favorites: string[];
    favoritesSet: Set<string>;
    toggleFavorite: (id: string) => Promise<void>;
    isFavorited: (id: string | number) => boolean;
    isLoaded: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const lastSyncedUserRef = useRef<string | null>(null);

    // Initial load from localStorage (guest/fallback)
    useEffect(() => {
        if (typeof window === 'undefined') return;

        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                setFavorites(JSON.parse(saved));
            }
        } catch (error) {
            console.error('Failed to load favorites:', error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Sync from DB if user is logged in
    useEffect(() => {
        const userId = user?.id || user?.userId; // Adjust based on user object structure
        if (user && isLoaded && lastSyncedUserRef.current !== userId) {
            lastSyncedUserRef.current = userId;
            getFavoritesAction().then(dbFavs => {
                if (dbFavs && dbFavs.length > 0) {
                    setFavorites(dbFavs);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(dbFavs));
                }
            });
        } else if (!user) {
            // Reset if logged out
            lastSyncedUserRef.current = null;
        }
    }, [user, isLoaded]);

    // Persist changes to localStorage
    useEffect(() => {
        if (isLoaded && typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
        }
    }, [favorites, isLoaded]);

    const toggleFavorite = useCallback(async (id: string) => {
        // Optimistic update
        setFavorites(prev => {
            const next = prev.includes(id)
                ? prev.filter(fid => fid !== id)
                : [...prev, id];
            return next;
        });

        if (user) {
            const result = await toggleFavoriteAction(id);
            if (result.error) {
                console.error('DB Sync failed:', result.error);
                // Optional: Revert state if critical
            }
        }
    }, [user]);

    const favoritesSet = useMemo(() => new Set(favorites), [favorites]);

    const isFavorited = useCallback((id: string | number) => {
        return favoritesSet.has(String(id));
    }, [favoritesSet]);

    const value = useMemo(() => ({
        favorites,
        favoritesSet,
        toggleFavorite,
        isFavorited,
        isLoaded
    }), [favorites, favoritesSet, toggleFavorite, isFavorited, isLoaded]);

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavoritesContext() {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavoritesContext must be used within a FavoritesProvider');
    }
    return context;
}
