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

export async function updateSiteContent(key: string, content: string, description: string = '') {
    const adminId = await ensureAdmin();

    try {
        await db.query(`
            INSERT INTO site_content (key, content, description, updated_by, updated_at)
            VALUES ($1, $2, $3, $4, NOW())
            ON CONFLICT (key) 
            DO UPDATE SET content = $2, description = $3, updated_by = $4, updated_at = NOW()
        `, [key, content, description, adminId]);

        // Log action
        await db.query(
            'INSERT INTO admin_audit_logs (admin_id, action, target_id, details) VALUES ($1, $2, $3, $4)',
            [adminId, 'update_content', null, JSON.stringify({ key, content_preview: content.substring(0, 50) })]
        );

        revalidatePath('/'); // Revalidate everything as content could be global
        return { success: true, message: 'Content updated successfully' };
    } catch (error) {
        console.error('Update Content Error:', error);
        return { success: false, message: 'Failed to update content' };
    }
}
