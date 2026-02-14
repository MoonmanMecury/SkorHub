
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

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
        const { createServerClient } = await import('@supabase/ssr');
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
            {
                cookies: {
                    getAll() { return cookieStore.getAll() },
                    setAll(cookiesToSet) {
                        // Note: We can't always set cookies in getSession if called during render
                        // but we can at least try or let the caller handle it.
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
            // We need to know if they are an admin. 
            // Since we can't easily query DB here without making getSession slow,
            // we'll return the basics. Dashboards will re-verify via DB if needed.
            // However, we MUST check if it's an admin for the AdminLayout specifically.
            const { db } = await import('@/lib/db');
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
