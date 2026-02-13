// app/actions/support.ts
'use server';

import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export type SupporterTier = 'supporter' | 'vip' | null;

export interface SupporterStatus {
    isSupporter: boolean;
    tier: SupporterTier;
    since: Date | null;
    expiresAt: Date | null;
    totalDonated: number;
    daysRemaining: number;
}

/**
 * Get current user's supporter status
 */
export async function getSupporterStatus(): Promise<SupporterStatus | null> {
    try {
        const session = await getSession();
        if (!session) return null;

        const result = await db.query(`
      SELECT 
        supporter_tier,
        supporter_since,
        supporter_expires_at,
        total_donated,
        CASE 
          WHEN supporter_tier IS NOT NULL 
            AND (supporter_expires_at IS NULL OR supporter_expires_at > NOW())
          THEN true
          ELSE false
        END as is_supporter,
        CASE 
          WHEN supporter_expires_at > NOW()
          THEN EXTRACT(DAY FROM supporter_expires_at - NOW())::int
          ELSE 0
        END as days_remaining
      FROM users
      WHERE id = $1
    `, [session.userId]);

        if (result.rows.length === 0) return null;

        const row = result.rows[0];
        return {
            isSupporter: row.is_supporter,
            tier: row.supporter_tier as SupporterTier,
            since: row.supporter_since,
            expiresAt: row.supporter_expires_at,
            totalDonated: parseFloat(row.total_donated || '0'),
            daysRemaining: row.days_remaining || 0,
        };
    } catch (error) {
        console.error('Get Supporter Status Error:', error);
        return null;
    }
}

/**
 * Check if user has VIP access (for feature gating)
 */
export async function isVIPSupporter(): Promise<boolean> {
    try {
        const session = await getSession();
        if (!session) return false;

        const result = await db.query(`
      SELECT is_vip_supporter($1) as is_vip
    `, [session.userId]);

        return result.rows[0]?.is_vip || false;
    } catch (error) {
        console.error('Check VIP Status Error:', error);
        return false;
    }
}

/**
 * Check if user has any supporter tier (for ad removal)
 */
export async function isActiveSupporter(): Promise<boolean> {
    try {
        const session = await getSession();
        if (!session) return false;

        const result = await db.query(`
      SELECT is_active_supporter($1) as is_supporter
    `, [session.userId]);

        return result.rows[0]?.is_supporter || false;
    } catch (error) {
        console.error('Check Supporter Status Error:', error);
        return false;
    }
}

/**
 * Get all supporters for the thank you page
 */
export async function getPublicSupporters() {
    try {
        const result = await db.query(`
      SELECT 
        display_name,
        supporter_tier as tier,
        supporter_since as first_donation_at,
        total_donated
      FROM public_supporters_view
      LIMIT 100
    `);

        return result.rows;
    } catch (error) {
        console.error('Get Public Supporters Error:', error);
        return [];
    }
}

/**
 * Get supporter statistics for the support page
 */
export async function getSupporterStats() {
    try {
        const result = await db.query(`
      SELECT 
        COUNT(DISTINCT CASE WHEN supporter_tier IS NOT NULL THEN id END) as total_supporters,
        COUNT(DISTINCT CASE WHEN supporter_tier = 'supporter' THEN id END) as supporter_count,
        COUNT(DISTINCT CASE WHEN supporter_tier = 'vip' THEN id END) as vip_count,
        COALESCE(SUM(total_donated), 0) as total_raised,
        COALESCE(
          (SELECT SUM(amount) 
           FROM payments 
           WHERE is_donation = true 
           AND status IN ('success', 'successful', 'completed')
           AND completed_at >= NOW() - INTERVAL '30 days'),
          0
        ) as monthly_revenue
      FROM users
      WHERE supporter_tier IS NOT NULL
    `);

        const stats = result.rows[0];

        // Use a minimum goal of K1000 or derive it
        const monthlyGoal = 1000;

        return {
            totalSupporters: parseInt(stats.total_supporters || '0'),
            supporterCount: parseInt(stats.supporter_count || '0'),
            vipCount: parseInt(stats.vip_count || '0'),
            totalRaised: parseFloat(stats.total_raised || '0'),
            monthlyRevenue: parseFloat(stats.monthly_revenue || '0'),
            monthlyGoal,
            progressPercent: Math.min(100, (parseFloat(stats.monthly_revenue || '0') / monthlyGoal) * 100),
        };
    } catch (error) {
        console.error('Get Supporter Stats Error:', error);
        return {
            totalSupporters: 0,
            supporterCount: 0,
            vipCount: 0,
            totalRaised: 0,
            monthlyRevenue: 0,
            monthlyGoal: 1000,
            progressPercent: 0,
        };
    }
}

/**
 * Update user's supporter acknowledgment settings
 */
export async function updateSupporterAcknowledgment(displayName: string, showOnPage: boolean) {
    try {
        const session = await getSession();
        if (!session) return { error: 'Unauthorized' };

        await db.query(`
        UPDATE users
        SET public_display_name = $1, is_public_supporter = $2
        WHERE id = $3
      `, [displayName, showOnPage, session.userId]);

        revalidatePath('/support');
        revalidatePath('/supporters');
        return { success: true };
    } catch (error) {
        console.error('Update Supporter Acknowledgment Error:', error);
        return { error: 'Failed to update acknowledgment' };
    }
}
