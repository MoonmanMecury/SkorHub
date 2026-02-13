// app/actions/watch-history.ts
'use server';

import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { isVIPSupporter } from './support';

export interface WatchHistoryEntry {
    id: string;
    matchId: string;
    sport: string | null;
    teamHome: string | null;
    teamAway: string | null;
    watchedAt: Date;
    durationSeconds: number;
    completed: boolean;
}

/**
 * Add a match to watch history (VIP only)
 */
export async function addToWatchHistory(
    matchId: string,
    sport?: string,
    teamHome?: string,
    teamAway?: string,
    durationSeconds: number = 0
) {
    try {
        const session = await getSession();
        if (!session) return { error: 'Unauthorized' };

        // Check if user is VIP
        const isVIP = await isVIPSupporter();
        if (!isVIP) {
            return { error: 'VIP feature only' };
        }

        // Check if entry already exists for this match today
        const existing = await db.query(`
      SELECT id, duration_seconds
      FROM watch_history
      WHERE user_id = $1 
      AND match_id = $2
      AND watched_at::date = CURRENT_DATE
      ORDER BY watched_at DESC
      LIMIT 1
    `, [session.userId, matchId]);

        if (existing.rows.length > 0) {
            // Update duration if provided
            if (durationSeconds > 0) {
                await db.query(`
          UPDATE watch_history
          SET duration_seconds = $1,
              completed = CASE WHEN $1 > 5400 THEN true ELSE false END
          WHERE id = $2
        `, [durationSeconds, existing.rows[0].id]);
            }
            return { success: true, updated: true };
        }

        // Insert new entry
        await db.query(`
      INSERT INTO watch_history 
      (user_id, match_id, sport, team_home, team_away, duration_seconds, completed)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
            session.userId,
            matchId,
            sport || null,
            teamHome || null,
            teamAway || null,
            durationSeconds,
            durationSeconds > 5400, // 90 minutes = completed
        ]);

        return { success: true, created: true };
    } catch (error) {
        console.error('Add to Watch History Error:', error);
        return { error: 'Failed to add to watch history' };
    }
}

/**
 * Get user's watch history (VIP only)
 */
export async function getWatchHistory(limit: number = 20, offset: number = 0): Promise<WatchHistoryEntry[]> {
    try {
        const session = await getSession();
        if (!session) return [];

        // Check if user is VIP
        const isVIP = await isVIPSupporter();
        if (!isVIP) return [];

        const result = await db.query(`
      SELECT 
        id,
        match_id,
        sport,
        team_home,
        team_away,
        watched_at,
        duration_seconds,
        completed
      FROM watch_history
      WHERE user_id = $1
      ORDER BY watched_at DESC
      LIMIT $2 OFFSET $3
    `, [session.userId, limit, offset]);

        return result.rows.map(row => ({
            id: row.id,
            matchId: row.match_id,
            sport: row.sport,
            teamHome: row.team_home,
            teamAway: row.team_away,
            watchedAt: row.watched_at,
            durationSeconds: row.duration_seconds,
            completed: row.completed,
        }));
    } catch (error) {
        console.error('Get Watch History Error:', error);
        return [];
    }
}

/**
 * Get recently watched matches (VIP only)
 */
export async function getRecentlyWatched(limit: number = 10): Promise<string[]> {
    try {
        const session = await getSession();
        if (!session) return [];

        const isVIP = await isVIPSupporter();
        if (!isVIP) return [];

        const result = await db.query(`
      SELECT DISTINCT match_id
      FROM watch_history
      WHERE user_id = $1
      AND watched_at >= NOW() - INTERVAL '7 days'
      ORDER BY watched_at DESC
      LIMIT $2
    `, [session.userId, limit]);

        return result.rows.map(row => row.match_id);
    } catch (error) {
        console.error('Get Recently Watched Error:', error);
        return [];
    }
}

/**
 * Clear watch history (VIP only)
 */
export async function clearWatchHistory() {
    try {
        const session = await getSession();
        if (!session) return { error: 'Unauthorized' };

        const isVIP = await isVIPSupporter();
        if (!isVIP) {
            return { error: 'VIP feature only' };
        }

        await db.query(
            'DELETE FROM watch_history WHERE user_id = $1',
            [session.userId]
        );

        return { success: true };
    } catch (error) {
        console.error('Clear Watch History Error:', error);
        return { error: 'Failed to clear watch history' };
    }
}

/**
 * Get watch statistics (VIP only)
 */
export async function getWatchStats() {
    try {
        const session = await getSession();
        if (!session) return null;

        const isVIP = await isVIPSupporter();
        if (!isVIP) return null;

        const result = await db.query(`
      SELECT 
        COUNT(DISTINCT match_id) as total_matches,
        COUNT(*) as total_views,
        SUM(duration_seconds) as total_watch_time,
        COUNT(CASE WHEN completed THEN 1 END) as completed_matches,
        COUNT(DISTINCT sport) as sports_watched,
        sport as favorite_sport
      FROM watch_history
      WHERE user_id = $1
      GROUP BY sport
      ORDER BY COUNT(*) DESC
      LIMIT 1
    `, [session.userId]);

        if (result.rows.length === 0) {
            return {
                totalMatches: 0,
                totalViews: 0,
                totalWatchTime: 0,
                completedMatches: 0,
                sportsWatched: 0,
                favoriteSport: null,
            };
        }

        const stats = result.rows[0];
        return {
            totalMatches: parseInt(stats.total_matches || '0'),
            totalViews: parseInt(stats.total_views || '0'),
            totalWatchTime: parseInt(stats.total_watch_time || '0'),
            completedMatches: parseInt(stats.completed_matches || '0'),
            sportsWatched: parseInt(stats.sports_watched || '0'),
            favoriteSport: stats.favorite_sport,
        };
    } catch (error) {
        console.error('Get Watch Stats Error:', error);
        return null;
    }
}
