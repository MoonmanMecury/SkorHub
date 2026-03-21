'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getFavoritesAction, toggleFavoriteAction } from '@/app/actions/favorites';

const STORAGE_KEY = '9streams_favorites_v3';

interface FavoritesContextType {
    favorites: string[];
    favoritesSet: Set<string>;
    isLoaded: boolean;
    toggleFavorite: (id: string) => Promise<void>;
    isFavorited: (id: string | number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [favoritesSet, setFavoritesSet] = useState<Set<string>>(new Set());
    const [isLoaded, setIsLoaded] = useState(false);

    // Initial load from localStorage (fallback/guest)
    useEffect(() => {
        if (typeof window === 'undefined') return;

        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    setFavoritesSet(new Set(parsed));
                }
            }
        } catch (error) {
            console.error('Failed to load favorites:', error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Load from DB if user is logged in
    useEffect(() => {
        if (user && isLoaded) {
            getFavoritesAction().then(dbFavs => {
                if (dbFavs && dbFavs.length > 0) {
                    setFavoritesSet(new Set(dbFavs));
                    // Sync to local storage too
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(dbFavs));
                }
            });
        }
    }, [user, isLoaded]);

    const toggleFavorite = useCallback(async (id: string) => {
        const idStr = String(id);

        // Optimistic UI update
        setFavoritesSet(prev => {
            const next = new Set(prev);
            if (next.has(idStr)) {
                next.delete(idStr);
            } else {
                next.add(idStr);
            }
            return next;
        });

        // Sync to DB if logged in
        if (user) {
            const result = await toggleFavoriteAction(idStr);
            if (result.error) {
                console.error('DB Sync failed:', result.error);
            }
        }
    }, [user]);

    // Side effect to sync localStorage when favoritesSet changes
    useEffect(() => {
        if (isLoaded && typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(favoritesSet)));
        }
    }, [favoritesSet, isLoaded]);

    const isFavorited = useCallback((id: string | number) => {
        return favoritesSet.has(String(id));
    }, [favoritesSet]);

    const favoritesArray = useMemo(() => Array.from(favoritesSet), [favoritesSet]);

    const value = useMemo(() => ({
        favorites: favoritesArray,
        favoritesSet,
        isLoaded,
        toggleFavorite,
        isFavorited
    }), [favoritesArray, favoritesSet, isLoaded, toggleFavorite, isFavorited]);

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
