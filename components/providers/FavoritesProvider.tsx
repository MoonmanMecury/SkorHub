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

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const initialSyncRef = useRef(false);

    // Initial load from localStorage (fallback/guest)
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                setFavorites(JSON.parse(saved));
            }
        } catch (error) {
            console.error('Failed to load favorites from localStorage:', error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Load from DB if user is logged in
    useEffect(() => {
        if (user && isLoaded && !initialSyncRef.current) {
            getFavoritesAction().then(dbFavs => {
                if (dbFavs && dbFavs.length > 0) {
                    setFavorites(dbFavs);
                    // No need to set localStorage here, the next useEffect will handle it
                }
                initialSyncRef.current = true;
            });
        }
    }, [user, isLoaded]);

    // Synchronize to localStorage whenever favorites state changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
        }
    }, [favorites, isLoaded]);

    const favoritesSet = useMemo(() => new Set(favorites), [favorites]);

    const toggleFavorite = useCallback(async (id: string) => {
        // Optimistic UI update
        setFavorites(prev => {
            return prev.includes(id)
                ? prev.filter(fid => fid !== id)
                : [...prev, id];
        });

        // Sync to DB if logged in
        if (user) {
            const result = await toggleFavoriteAction(id);
            if (result.error) {
                console.error('DB Sync failed:', result.error);
                // Revert optimistic update on failure
                setFavorites(prev => {
                    return prev.includes(id)
                        ? prev.filter(fid => fid !== id)
                        : [...prev, id];
                });
            }
        }
    }, [user]);

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
    if (context === undefined) {
        throw new Error('useFavoritesContext must be used within a FavoritesProvider');
    }
    return context;
}
