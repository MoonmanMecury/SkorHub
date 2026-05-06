'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getFavoritesAction, toggleFavoriteAction } from '@/app/actions/favorites';

const STORAGE_KEY = '9streams_favorites_v3';

interface FavoritesContextType {
    favorites: string[];
    isLoaded: boolean;
    toggleFavorite: (id: string) => Promise<void>;
    isFavorited: (id: string | number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    // Initialize state from localStorage directly if available to avoid cascading renders
    const [favorites, setFavorites] = useState<string[]>(() => {
        if (typeof window === 'undefined') return [];
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    const [isLoaded, setIsLoaded] = useState(false);
    const hasSyncStarted = useRef(false);

    // Mark as loaded after mount - using a timeout to avoid synchronous setState in effect linter error
    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 0);
        return () => clearTimeout(timer);
    }, []);

    // Load from DB if user is logged in
    useEffect(() => {
        if (user && isLoaded && !hasSyncStarted.current) {
            hasSyncStarted.current = true;
            getFavoritesAction().then(dbFavs => {
                if (dbFavs && dbFavs.length > 0) {
                    setFavorites(dbFavs);
                    // Sync to local storage too
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(dbFavs));
                }
            });
        }
    }, [user, isLoaded]);

    const toggleFavorite = useCallback(async (id: string) => {
        let updatedFavorites: string[] = [];

        setFavorites(prev => {
            const next = prev.includes(id)
                ? prev.filter(fid => fid !== id)
                : [...prev, id];
            updatedFavorites = next;
            return next;
        });

        // Side effect outside of state updater
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFavorites));
        }

        // Sync to DB if logged in
        if (user) {
            const result = await toggleFavoriteAction(id);
            if (result.error) {
                console.error('DB Sync failed:', result.error);
                // Optionally revert local state here if sync is critical
            }
        }
    }, [user]);

    const isFavorited = useCallback((id: string | number) => {
        return favorites.includes(String(id));
    }, [favorites]);

    return (
        <FavoritesContext.Provider value={{ favorites, isLoaded, toggleFavorite, isFavorited }}>
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
