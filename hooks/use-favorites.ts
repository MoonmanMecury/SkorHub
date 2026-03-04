'use client';

import { useFavoritesContext } from '@/components/providers/FavoritesProvider';

/**
 * Hook to access and manage user favorites.
 * Uses a centralized context to ensure state consistency and optimize performance.
 *
 * Performance Optimizations:
 * 1. Centralized state: Prevents redundant DB fetches and localStorage operations.
 * 2. O(1) Lookups: Uses a Set for `isFavorited` checks instead of O(N) array lookups.
 */
export function useFavorites() {
    return useFavoritesContext();
}
