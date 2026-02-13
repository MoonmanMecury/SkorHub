'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './use-auth';
import { getFavoritesAction, toggleFavoriteAction } from '@/app/actions/favorites';

const STORAGE_KEY = '9streams_favorites_v3';

export function useFavorites() {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Initial load from localStorage (fallback/guest)
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

    // Load from DB if user is logged in
    useEffect(() => {
        if (user && isLoaded) {
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

    return {
        favorites,
        toggleFavorite,
        isFavorited,
        isLoaded
    };
}
