'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getFavoritesAction, toggleFavoriteAction } from '@/app/actions/favorites';

const STORAGE_KEY = '9streams_favorites_v3';

interface FavoritesContextType {
    favorites: string[];
    isFavorited: (id: string | number) => boolean;
    toggleFavorite: (id: string) => Promise<void>;
    isLoaded: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Optimize lookups with a Set
    const favoritesSet = useMemo(() => new Set(favorites), [favorites]);

    // Initial load from localStorage (fallback/guest)
    useEffect(() => {
        if (typeof window === 'undefined') return;

        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                setFavorites(JSON.parse(saved));
            }
        } catch (error) {
            console.error('Failed to load favorites from local storage:', error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Load from DB if user is logged in
    useEffect(() => {
        if (user && isLoaded) {
            getFavoritesAction().then(dbFavs => {
                if (dbFavs && dbFavs.length > 0) {
                    setFavorites(dbFavs);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(dbFavs));
                }
            });
        }
    }, [user, isLoaded]);

    const toggleFavorite = useCallback(async (id: string) => {
        // Optimistic UI update
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
            try {
                const result = await toggleFavoriteAction(id);
                if (result.error) {
                    console.error('DB Sync failed:', result.error);
                }
            } catch (error) {
                console.error('Error toggling favorite in DB:', error);
            }
        }
    }, [user]);

    const isFavorited = useCallback((id: string | number) => {
        return favoritesSet.has(String(id));
    }, [favoritesSet]);

    const value = useMemo(() => ({
        favorites,
        isFavorited,
        toggleFavorite,
        isLoaded
    }), [favorites, isFavorited, toggleFavorite, isLoaded]);

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavoritesContext() {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavoritesContext must be used within a FavoritesProvider');
    }
    return context;
}
