'use server';

import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// Helper to ensure admin
async function ensureAdmin() {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');

    const result = await db.query('SELECT is_admin FROM users WHERE id = $1', [session.userId]);
    if (!result.rows[0]?.is_admin) throw new Error('Forbidden');

    return session.userId;
}

export async function submitFeedback(formData: FormData) {
    const session = await getSession();
    const userId = session?.userId || null;
    const type = formData.get('type') as string;
    const message = formData.get('message') as string;

    if (!message) return { success: false, message: 'Message is required' };

    try {
        await db.query(`
            INSERT INTO feedback (user_id, type, message, status)
            VALUES ($1, $2, $3, 'new')
        `, [userId, type, message]);

        return { success: true, message: 'Feedback submitted successfully' };
    } catch (error) {
        console.error('Submit Feedback Error:', error);
        return { success: false, message: 'Failed to submit feedback' };
    }
}

export async function updateFeedbackStatus(id: string, newStatus: string, note: string = '') {
    const adminId = await ensureAdmin();

    try {
        await db.query(`
            UPDATE feedback 
            SET status = $1, admin_notes = $2 
            WHERE id = $3
        `, [newStatus, note, id]);

        revalidatePath('/admin/feedback');
        return { success: true };
    } catch (error) {
        console.error('Update Feedback Error:', error);
        return { success: false, message: 'Failed to update feedback status' };
    }
}
