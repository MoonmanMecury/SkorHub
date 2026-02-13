'use server';

import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Helper to ensure admin
async function ensureAdmin() {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');

    const result = await db.query('SELECT is_admin FROM users WHERE id = $1', [session.userId]);
    if (!result.rows[0]?.is_admin) throw new Error('Forbidden');

    return session.userId;
}

export async function toggleUserBan(userId: string, currentStatus: boolean) {
    const adminId = await ensureAdmin();
    const newStatus = !currentStatus;

    try {
        await db.query('UPDATE users SET is_active = $1 WHERE id = $2', [newStatus, userId]);

        // Log action
        await db.query(
            'INSERT INTO admin_audit_logs (admin_id, action, target_id, details) VALUES ($1, $2, $3, $4)',
            [adminId, newStatus ? 'unban_user' : 'ban_user', userId, JSON.stringify({ previous_status: currentStatus })]
        );

        revalidatePath(`/admin/users/${userId}`);
        return { success: true, message: `User ${newStatus ? 'activated' : 'banned'} successfully.` };
    } catch (error) {
        console.error('Toggle Ban Error:', error);
        return { success: false, message: 'Failed to update user status.' };
    }
}

export async function manualSubscriptionOverride(formData: FormData) {
    const adminId = await ensureAdmin();

    const userId = formData.get('userId') as string;
    const tier = formData.get('tier') as string;
    const days = parseInt(formData.get('days') as string) || 30;
    const notes = formData.get('notes') as string;
    const amount = parseFloat(formData.get('amount') as string) || 0;

    if (!userId || !tier) {
        return { success: false, message: 'Missing required fields' };
    }

    try {
        // Calculate expiration
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + days);

        // 1. Update User
        await db.query(`
            UPDATE users 
            SET supporter_tier = $1,
                supporter_since = COALESCE(supporter_since, NOW()),
                supporter_expires_at = $2,
                notes = $3
            WHERE id = $4
        `, [tier, expiresAt.toISOString(), notes, userId]);

        // 2. Record "Manual" Payment (for records)
        if (amount > 0) {
            await db.query(`
                INSERT INTO payments (
                    user_id, amount, currency, status, reference, provider, donation_tier, is_recurring, metadata, completed_at
                ) VALUES (
                    $1, $2, 'ZMW', 'completed', $3, 'manual_admin', $4, false, $5, NOW()
                )
            `, [
                userId,
                amount,
                `MANUAL-${Date.now()}`, // Unique Ref
                tier,
                JSON.stringify({ admin_notes: notes, admin_id: adminId })
            ]);
        }

        // 3. Log Audit
        await db.query(
            'INSERT INTO admin_audit_logs (admin_id, action, target_id, details) VALUES ($1, $2, $3, $4)',
            [adminId, 'manual_override', userId, JSON.stringify({ tier, days, notes, amount })]
        );

        revalidatePath(`/admin/users/${userId}`);
        return { success: true, message: 'User subscription updated successfully.' };
    } catch (error) {
        console.error('Manual Override Error:', error);
        return { success: false, message: 'Failed to update subscription.' };
    }
}

export async function updateUserNotes(formData: FormData) {
    const adminId = await ensureAdmin();
    const userId = formData.get('userId') as string;
    const notes = formData.get('notes') as string;

    try {
        await db.query('UPDATE users SET notes = $1 WHERE id = $2', [notes, userId]);
        revalidatePath(`/admin/users/${userId}`);
        return { success: true };
    } catch (error) {
        return { success: false, message: 'Failed to update notes' };
    }
}
