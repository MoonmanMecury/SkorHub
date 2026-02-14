
'use server'

import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function getUserProfile() {
  const session = await getSession();
  if (!session) return null;

  // Get user with active subscription and favorites count
  let result = await db.query(`
      SELECT 
        u.id,
        u.email,
        u.created_at,
        s.id as subscription_id,
        s.status as subscription_status,
        s.start_date,
        s.end_date as premium_expires,
        s.amount,
        s.currency,
        CASE 
          WHEN s.status = 'active' AND s.end_date > NOW() THEN true
          ELSE false
        END as premium,
        CASE 
          WHEN s.status = 'active' AND s.end_date > NOW() 
          THEN EXTRACT(DAY FROM s.end_date - NOW())::int
          ELSE 0
        END as days_remaining,
        (SELECT COUNT(*)::int FROM favorites WHERE user_id = u.id) as favorites_count,
        u.supporter_tier,
        u.supporter_since,
        u.supporter_expires_at,
        u.total_donated
      FROM users u
      LEFT JOIN subscriptions s ON s.user_id = u.id 
        AND s.status = 'active' 
        AND s.end_date > NOW()
      WHERE u.id = $1
      ORDER BY s.end_date DESC
      LIMIT 1
    `, [session.userId]);

  if (result.rows.length === 0) {
    // SELF-HEALING: User exists in session (Supabase) but missing in our users table
    await db.query(
      'INSERT INTO users (id, email) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING',
      [session.userId, session.email]
    );

    // Re-query to get the newly created profile
    result = await db.query('SELECT *, FALSE as premium, 0 as favorites_count FROM users WHERE id = $1', [session.userId]);
  }

  if (result.rows.length === 0) return null;

  return result.rows[0];
}

export async function getUserPayments(limit = 10, offset = 0) {
  const session = await getSession();
  if (!session) return null;

  const result = await db.query(`
      SELECT 
        id,
        reference,
        lenco_reference,
        amount,
        currency,
        status,
        payment_method,
        phone_number,
        initiated_at,
        completed_at
      FROM payments
      WHERE user_id = $1
      ORDER BY initiated_at DESC
      LIMIT $2 OFFSET $3
    `, [session.userId, limit, offset]);

  return result.rows;
}
