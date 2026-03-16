'use client';

import { useFavoritesContext } from '@/components/providers/FavoritesProvider';

/**
 * Hook to consume the centralized favorites context.
 * Provides O(1) lookup performance and synchronized state.
 */
export function useFavorites() {
    return useFavoritesContext();
}
