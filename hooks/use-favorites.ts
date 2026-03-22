'use client';

import { useFavoritesContext } from '@/components/providers/FavoritesProvider';

/**
 * Hook to access and manage user favorites.
 * Now consumes a centralized FavoritesProvider to avoid redundant API calls and sync state across components.
 */
export function useFavorites() {
    return useFavoritesContext();
}
