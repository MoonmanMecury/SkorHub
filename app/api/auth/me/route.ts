
import { NextResponse } from 'next/server';
import { getSession, signToken } from '@/lib/auth';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function GET() {
  try {
    const cookieStore = await cookies();
    let session = await getSession();

    // Re-sync: If custom token is missing but Supabase session exists, recreate the token
    if (!session) {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
        {
          cookies: {
            getAll() { return cookieStore.getAll() },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            },
          },
        }
      );

      const { data: { user: sbUser } } = await supabase.auth.getUser();

      if (sbUser) {
        const userCheck = await db.query('SELECT is_admin FROM users WHERE id = $1', [sbUser.id]);
        let isAdmin = false;

        if (userCheck.rows.length === 0) {
          // Sync missing user
          await db.query(
            'INSERT INTO users (id, email) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING',
            [sbUser.id, sbUser.email]
          );
          isAdmin = false;
        } else {
          isAdmin = userCheck.rows[0]?.is_admin || false;
        }

        const newToken = signToken({
          userId: sbUser.id,
          email: sbUser.email,
          isAdmin: isAdmin
        });

        cookieStore.set('token', newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 7 * 24 * 60 * 60,
          path: '/',
        });

        session = { userId: sbUser.id, email: sbUser.email, isAdmin };
      }
    }

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
