
'use server';

import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { streamedApi } from '@/lib/streamed';

/**
 * Toggles a match in the user's favorites in the database.
 */
export async function toggleFavoriteAction(itemId: string, itemType: string = 'match') {
    try {
        const session = await getSession();
        if (!session) return { error: 'Unauthorized' };

        const userId = session.userId;

        // Check if already favorited
        const check = await db.query(
            'SELECT id FROM favorites WHERE user_id = $1 AND item_id = $2 AND item_type = $3',
            [userId, itemId, itemType]
        );

        if (check.rows.length > 0) {
            // Remove it
            await db.query(
                'DELETE FROM favorites WHERE user_id = $1 AND item_id = $2 AND item_type = $3',
                [userId, itemId, itemType]
            );
        } else {
            // Add it
            await db.query(
                'INSERT INTO favorites (user_id, item_id, item_type) VALUES ($1, $2, $3)',
                [userId, itemId, itemType]
            );
        }

        revalidatePath('/(dashboard)/account', 'page');
        revalidatePath('/(dashboard)/favorites', 'page');
        return { success: true };
    } catch (error) {
        console.error('Toggle Favorite Error:', error);
        return { error: 'Failed to update favorites' };
    }
}

/**
 * Fetches all favorites for the current user from the database.
 */
export async function getFavoritesAction() {
    try {
        const session = await getSession();
        if (!session) return [];

        const result = await db.query(
            'SELECT item_id FROM favorites WHERE user_id = $1',
            [session.userId]
        );

        return result.rows.map(row => row.item_id);
    } catch (error) {
        console.error('Get Favorites Error:', error);
        return [];
    }
}

/**
 * Automatically scrubs stale match IDs from the user's database records.
 * Triggered in the background when viewing the collection.
 */
export async function cleanupFavoritesAction() {
    try {
        const session = await getSession();
        if (!session) return { success: false };

        // 1. Get user's current favorites from DB (only for matches)
        const userFavs = await db.query(
            "SELECT item_id FROM favorites WHERE user_id = $1 AND item_type = 'match'",
            [session.userId]
        );
        if (userFavs.rows.length === 0) return { success: true };

        // 2. Get active matches from API
        const allMatches = await streamedApi.getAllMatches();
        const liveMatches = await streamedApi.getLiveMatches();
        const validIds = new Set([
            ...allMatches.map((m: any) => String(m.id)),
            ...liveMatches.map((m: any) => String(m.id))
        ]);

        // 3. Identify IDs that exist in DB but are gone from API
        const invalidIds = userFavs.rows
            .map(row => row.item_id)
            .filter(id => !validIds.has(id));

        if (invalidIds.length > 0) {
            // 4. Batch scrub the dead entries
            await db.query(`
                DELETE FROM favorites 
                WHERE user_id = $1 AND item_id = ANY($2) AND item_type = 'match'
            `, [session.userId, invalidIds]);

            console.log(`[Database Maintenance] Scrubbed ${invalidIds.length} dead favorites for user: ${session.userId}`);
            revalidatePath('/(dashboard)/account', 'page');
        }

        return { success: true };
    } catch (error) {
        console.error('Cleanup Favorites Error:', error);
        return { error: 'Database scrub failed' };
    }
}
