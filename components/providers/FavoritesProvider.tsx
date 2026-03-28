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

    // Use a ref to track the last user we synced for, to avoid redundant fetches
    const lastSyncedUserRef = useRef<string | null>(null);

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
        if (user && isLoaded && lastSyncedUserRef.current !== user.id) {
            getFavoritesAction().then(dbFavs => {
                if (dbFavs && dbFavs.length > 0) {
                    setFavorites(dbFavs);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(dbFavs));
                }
                lastSyncedUserRef.current = user.id;
            });
        } else if (!user) {
            lastSyncedUserRef.current = null;
        }
    }, [user, isLoaded]);

    const favoritesSet = useMemo(() => new Set(favorites), [favorites]);

    const isFavorited = useCallback((id: string | number) => {
        return favoritesSet.has(String(id));
    }, [favoritesSet]);

    const toggleFavorite = useCallback(async (id: string) => {
        const stringId = String(id);
        const isCurrentlyFavorited = favoritesSet.has(stringId);

        // Optimistic UI update
        const nextFavorites = isCurrentlyFavorited
            ? favorites.filter(fid => fid !== stringId)
            : [...favorites, stringId];

        setFavorites(nextFavorites);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextFavorites));

        // Sync to DB if logged in
        if (user) {
            const result = await toggleFavoriteAction(stringId);
            if (result.error) {
                console.error('DB Sync failed:', result.error);
                // Revert state if sync fails
                setFavorites(favorites);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
            }
        }
    }, [user, favorites, favoritesSet]);

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
