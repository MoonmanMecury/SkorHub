
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

    if (!token) return null;

    const decoded = verifyToken(token);
    return decoded; // returns { userId: string, email: string, ... }
}

// Helper to check if user is authenticated (throws if not)
export async function authenticate() {
    const session = await getSession();
    if (!session) {
        throw new Error('Unauthorized');
    }
    return session;
}
