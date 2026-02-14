
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

    // FALLBACK: If token is missing, check if they have a valid Supabase session
    try {
        const { createServerClient } = await import('@supabase/ssr');
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
            {
                cookies: {
                    getAll() { return cookieStore.getAll() },
                    setAll() { /* Read-only in this context */ },
                },
            }
        );

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            // Need to know if admin for the payload
            const { db } = await import('./db');
            const result = await db.query('SELECT is_admin FROM users WHERE id = $1', [user.id]);
            const isAdmin = result.rows[0]?.is_admin || false;

            return {
                userId: user.id,
                email: user.email,
                isAdmin: isAdmin
            };
        }
    } catch (e) {
        console.error("Session fallback error:", e);
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
