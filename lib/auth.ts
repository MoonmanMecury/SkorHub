
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { db } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_during_dev';

export function verifyToken(token: string): any {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return null;
    }
}

export function signToken(payload: any): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// Server Component / API helper to get current session
export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (token) {
        const decoded = verifyToken(token);
        if (decoded) return decoded;
    }

    // Fallback: Check Supabase session if legacy token is missing or invalid
    try {
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
            {
                cookies: {
                    getAll() { return cookieStore.getAll() },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                        } catch (e) {
                            // Ignore cookie set errors in render phase
                        }
                    },
                },
            }
        );

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const result = await db.query('SELECT is_admin FROM users WHERE id = $1', [user.id]);
            const isAdmin = result.rows[0]?.is_admin || false;

            return {
                userId: user.id,
                email: user.email,
                isAdmin: isAdmin
            };
        }
    } catch (err) {
        console.error('getSession fallback error:', err);
    }

    return null;
}

// Helper to check if user is authenticated (throws if not)
export async function authenticate() {
    const session = await getSession();
    if (!session) {
        throw new Error('Unauthorized');
    }
    return session;
}
