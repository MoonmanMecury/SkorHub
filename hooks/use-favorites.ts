'use client';

import { useMemo } from 'react';
import { useFavoritesContext } from '@/components/providers/FavoritesProvider';

/**
 * Hook to access and manage favorites.
 * Now consumes a centralized context for better performance and consistency.
 */
export function useFavorites() {
    const { favorites, toggleFavorite, isFavorited, isLoaded } = useFavoritesContext();

    // Memoize the array conversion to avoid reference instability on every render
    const favoritesArray = useMemo(() => Array.from(favorites), [favorites]);

    return {
        favorites: favoritesArray,
        toggleFavorite,
        isFavorited,
        isLoaded
    };
}
