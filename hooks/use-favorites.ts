'use client';

import { useFavoritesContext } from '@/components/providers/FavoritesProvider';

/**
 * Hook to access and manipulate the user's favorite matches.
 * Now consumes a central FavoritesProvider to avoid redundant network calls and state desync.
 */
export function useFavorites() {
    const { favorites, toggleFavorite, isFavorited, isLoaded } = useFavoritesContext();

    return {
        favorites,
        toggleFavorite,
        isFavorited,
        isLoaded
    };
}
