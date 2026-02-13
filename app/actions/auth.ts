
// app/actions/auth.ts
'use server'

import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { sendPasswordResetEmail } from '@/lib/email';


export async function login(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { error: 'Please provide both email and password' };
    }

    try {
        // 1. Find user and check for active subscription
        const result = await db.query(`
          SELECT u.*, s.end_date 
          FROM users u 
          LEFT JOIN subscriptions s ON u.id = s.user_id 
          AND s.status = 'active' 
          AND s.end_date > NOW()
          WHERE u.email = $1
          ORDER BY s.end_date DESC LIMIT 1
        `, [email]);

        if (result.rows.length === 0) {
            return { error: 'Invalid credentials' };
        }

        const user = result.rows[0];

        // 2. Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return { error: 'Invalid credentials' };
        }

        // 3. Create Token
        const token = signToken({
            userId: user.id,
            email: user.email,
            isAdmin: user.is_admin
        });

        // 4. Set Cookie
        const cookieStore = await cookies();
        cookieStore.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
        });

        return { success: true, isAdmin: user.is_admin };
    } catch (error) {
        console.error('Login error:', error);
        return { error: 'Server error' };
    }
}

export async function register(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { error: 'Please provide both email and password' };
    }

    try {
        // 1. Check if user exists
        const userCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return { error: 'User already exists' };
        }

        // 2. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Insert into Supabase
        const newUser = await db.query(
            'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
            [email, hashedPassword]
        );

        const user = newUser.rows[0];

        // 4. Create Token and Set Cookie
        const token = signToken({ userId: user.id, email: user.email });

        const cookieStore = await cookies();
        cookieStore.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
        });

        return { success: true };
    } catch (error) {
        console.error('Register error:', error);
        return { error: 'Server error during registration' };
    }
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('token');
    redirect('/sign-in');
}

export async function requestPasswordReset(formData: FormData) {
    const email = formData.get('email') as string;

    if (!email) return { error: 'Email is required' };

    try {
        // 1. Check if user exists
        const userResult = await db.query('SELECT id FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            // Return success even if user not found to prevent enumeration
            return { success: true, message: 'If an account exists, a reset link has been sent.' };
        }

        const userId = userResult.rows[0].id;

        // 2. Generate Token
        // Using crypto for a random token
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour

        // 3. Save to DB
        await db.query(`
            INSERT INTO password_resets (user_id, token, expires_at)
            VALUES ($1, $2, $3)
        `, [userId, token, expiresAt.toISOString()]);

        // 4. Send Email
        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

        const { error: emailError } = await sendPasswordResetEmail(email, resetLink);

        if (emailError) {
            console.error('Failed to send reset email:', emailError);
            // We tell the user it's sent anyway to prevent enumeration, but log the error
        }

        return { success: true, message: 'If an account exists, a reset link has been sent.' };
    } catch (error) {

        console.error('Request Reset Error:', error);
        return { error: 'Something went wrong.' };
    }
}

export async function resetPassword(formData: FormData) {
    const token = formData.get('token') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!token || !password || !confirmPassword) {
        return { error: 'Missing fields' };
    }

    if (password !== confirmPassword) {
        return { error: 'Passwords do not match' };
    }

    try {
        // 1. Verify Token
        const result = await db.query(`
            SELECT * FROM password_resets 
            WHERE token = $1 
            AND expires_at > NOW()
            ORDER BY created_at DESC 
            LIMIT 1
        `, [token]);

        if (result.rows.length === 0) {
            return { error: 'Invalid or expired token' };
        }

        const resetRecord = result.rows[0];

        // 2. Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Update User
        await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashedPassword, resetRecord.user_id]);

        // 4. Delete Token (and all other tokens for this user)
        await db.query('DELETE FROM password_resets WHERE user_id = $1', [resetRecord.user_id]);

        return { success: true };
    } catch (error) {
        console.error('Reset Password Error:', error);
        return { error: 'Failed to reset password' };
    }
}
