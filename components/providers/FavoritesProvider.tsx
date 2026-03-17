'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getFavoritesAction, toggleFavoriteAction } from '@/app/actions/favorites';

const STORAGE_KEY = '9streams_favorites_v3';

interface FavoritesContextType {
    favorites: Set<string>;
    toggleFavorite: (id: string) => Promise<void>;
    isFavorited: (id: string | number) => boolean;
    isLoaded: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [isLoaded, setIsLoaded] = useState(false);

    // Initial load from localStorage
    useEffect(() => {
        if (typeof window === 'undefined') return;

        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    setFavorites(new Set(parsed));
                }
            }
        } catch (error) {
            console.error('Failed to load favorites from localStorage:', error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Load from DB if user is logged in
    useEffect(() => {
        if (user && isLoaded) {
            getFavoritesAction().then(dbFavs => {
                if (dbFavs && dbFavs.length > 0) {
                    const newFavs = new Set(dbFavs);
                    setFavorites(newFavs);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(newFavs)));
                }
            });
        }
    }, [user, isLoaded]);

    const toggleFavorite = useCallback(async (id: string) => {
        const stringId = String(id);

        setFavorites(prev => {
            const next = new Set(prev);
            if (next.has(stringId)) {
                next.delete(stringId);
            } else {
                next.add(stringId);
            }

            if (typeof window !== 'undefined') {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
            }
            return next;
        });

        if (user) {
            const result = await toggleFavoriteAction(stringId);
            if (result.error) {
                console.error('DB Sync failed:', result.error);
                // In a real app, we might want to rollback local state here
            }
        }
    }, [user]);

    const isFavorited = useCallback((id: string | number) => {
        return favorites.has(String(id));
    }, [favorites]);

    const value = useMemo(() => ({
        favorites,
        toggleFavorite,
        isFavorited,
        isLoaded
    }), [favorites, toggleFavorite, isFavorited, isLoaded]);

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
