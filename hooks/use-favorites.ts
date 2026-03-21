'use client';

import { useFavoritesContext } from '@/components/providers/FavoritesProvider';

/**
 * Hook to access centralized favorites state and actions.
 * Optimized with a Set for O(1) lookups and centralized context to avoid redundant effects.
 */
export function useFavorites() {
    return useFavoritesContext();
}
