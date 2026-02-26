'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getFavoritesAction, toggleFavoriteAction } from '@/app/actions/favorites';

const STORAGE_KEY = '9streams_favorites_v3';

interface FavoritesContextType {
    favorites: string[];
    toggleFavorite: (id: string) => Promise<void>;
    isFavorited: (id: string | number) => boolean;
    isLoaded: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

/**
 * Provides a centralized state for user favorites.
 * This prevents redundant localStorage reads and database syncs across multiple card components.
 */
export function FavoritesProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Initial load from localStorage (fallback for guests or until hydration)
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                setFavorites(JSON.parse(saved));
            }
        } catch (error) {
            console.error('Failed to load favorites from storage:', error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Sync with DB if user is logged in
    useEffect(() => {
        if (user && isLoaded) {
            getFavoritesAction().then(dbFavs => {
                // If dbFavs is an array (even empty), sync it to local state.
                // This ensures consistency across sessions and devices.
                if (Array.isArray(dbFavs)) {
                    setFavorites(dbFavs);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(dbFavs));
                }
            });
        }
    }, [user, isLoaded]);

    const toggleFavorite = useCallback(async (id: string) => {
        // Optimistic UI update using functional state
        setFavorites(prev => {
            const next = prev.includes(id)
                ? prev.filter(fid => fid !== id)
                : [...prev, id];

            if (typeof window !== 'undefined') {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            }
            return next;
        });

        // Sync to DB if logged in
        if (user) {
            const result = await toggleFavoriteAction(id);
            if (result?.error) {
                console.error('Database favorite sync failed:', result.error);
                // In a production app, we might want to revert the optimistic state here
            }
        }
    }, [user]);

    const isFavorited = useCallback((id: string | number) => {
        return favorites.includes(String(id));
    }, [favorites]);

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorited, isLoaded }}>
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
