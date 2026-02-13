
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // Get fresh user data from DB including premium status
    const result = await db.query(`
      SELECT 
        u.id, 
        u.email, 
        u.public_display_name,
        u.is_admin,
        u.supporter_tier,
        u.created_at,
        CASE 
          WHEN s.status = 'active' AND s.end_date > NOW() THEN true 
          ELSE false 
        END as premium,
        s.end_date as premium_expires
      FROM users u
      LEFT JOIN subscriptions s ON u.id = s.user_id 
        AND s.status = 'active' 
        AND s.end_date > NOW()
      WHERE u.id = $1
      ORDER BY s.end_date DESC
      LIMIT 1
    `, [session.userId]);

    if (result.rows.length === 0) {
      return NextResponse.json({ user: null }, { status: 404 });
    }

    return NextResponse.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Auth Me Error:', error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
