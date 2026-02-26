'use client';

import { useFavoritesContext } from '@/components/providers/FavoritesProvider';

/**
 * Hook to access favorites state and actions.
 * Optimized via a global context to prevent redundant state and effects in card components.
 */
export function useFavorites() {
    const context = useFavoritesContext();
    return context;
}
