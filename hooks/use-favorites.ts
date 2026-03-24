'use client';

import { useFavoritesContext } from '@/components/providers/FavoritesProvider';

/**
 * Hook to access and manage favorites.
 * Now consumes a centralized context for better performance and consistency.
 */
export function useFavorites() {
    return useFavoritesContext();
}
