
// app/actions/subscription.ts
'use server'

import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function checkSubscriptionStatus() {
    const session = await getSession();
    if (!session) return { premium: false, daysRemaining: 0 };

    // Check subscription logic (reuse query from user.ts or auth.ts)
    const result = await db.query(`
      SELECT 
        s.end_date,
        CASE 
          WHEN s.status = 'active' AND s.end_date > NOW() THEN true
          ELSE false
        END as premium,
        CASE 
          WHEN s.status = 'active' AND s.end_date > NOW() 
          THEN EXTRACT(DAY FROM s.end_date - NOW())::int
          ELSE 0
        END as days_remaining
      FROM subscriptions s
      WHERE s.user_id = $1
      ORDER BY s.end_date DESC
      LIMIT 1
    `, [session.userId]);

    if (result.rows.length === 0) return { premium: false, daysRemaining: 0 };

    return {
        premium: result.rows[0].premium,
        daysRemaining: result.rows[0].days_remaining,
        premiumExpires: result.rows[0].end_date
    };
}
