'use client';

import { useFavoritesContext } from '@/components/providers/FavoritesProvider';

/**
 * Hook to consume the Favorites context.
 * Centralizing the state in FavoritesProvider prevents redundant state
 * management and effects in every component that uses favorites.
 */
export function useFavorites() {
    return useFavoritesContext();
}
