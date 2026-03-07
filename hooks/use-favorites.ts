'use client';

import { useFavoritesContext } from '@/components/providers/FavoritesProvider';

/**
 * Hook to access and manage favorites.
 * Now wraps the centralized FavoritesProvider to ensure consistency and performance.
 */
export function useFavorites() {
    return useFavoritesContext();
}
