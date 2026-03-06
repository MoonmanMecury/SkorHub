'use client';

import { useFavoritesContext } from '@/components/providers/FavoritesProvider';

/**
 * Hook to consume the FavoritesContext.
 * Centralizing state here prevents redundant API calls and ensures UI sync.
 */
export function useFavorites() {
    return useFavoritesContext();
}
