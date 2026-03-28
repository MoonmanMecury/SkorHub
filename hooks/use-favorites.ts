'use client';

import { useFavoritesContext } from '@/components/providers/FavoritesProvider';

/**
 * Hook to access favorites state and actions.
 * Now consumes from FavoritesProvider for centralized state and O(1) lookups.
 */
export function useFavorites() {
    const context = useFavoritesContext();

    return {
        favorites: context.favorites,
        favoritesSet: context.favoritesSet,
        toggleFavorite: context.toggleFavorite,
        isFavorited: context.isFavorited,
        isLoaded: context.isLoaded
    };
}
