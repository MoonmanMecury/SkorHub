'use client';

import { useFavoritesContext } from '@/components/providers/FavoritesProvider';

/**
 * Hook to consume the centralized favorites context.
 * Prevents redundant localStorage reads and database syncs when used in multiple components.
 */
export function useFavorites() {
    return useFavoritesContext();
}
