import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

/**
 * Lenco Webhook Handler
 * POST /api/webhooks/lenco
 * 
 * This is the ultimate "Source of Truth" for payments.
 * Even if the user closes their browser, Lenco's server will call this.
 */
export async function POST(request: NextRequest) {
    try {
        const rawBody = await request.text();
        const payload = JSON.parse(rawBody);

        // 1. Signature Verification
        const hashKey = process.env.LENCO_WEBHOOK_HASH_KEY;
        const signature = request.headers.get('x-lenco-signature');

        if (hashKey && signature) {
            const hmac = crypto
                .createHmac('sha256', hashKey)
                .update(rawBody)
                .digest('hex');

            if (hmac !== signature) {
                console.error('[Webhook] Signature mismatch');
                return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
            }
        }

        // Lenco passes the transaction data in the body
        const { event, data } = payload;

        // We only care about successful collections
        if (event !== 'collection.successful') {
            return NextResponse.json({ message: 'Event ignored' });
        }

        const { reference, amount, currency, status, customer } = data;

        if (status !== 'successful') {
            return NextResponse.json({ message: 'Status not successful' });
        }

        // 1. Find the pending payment in our DB
        const paymentResult = await db.query(
            'SELECT * FROM payments WHERE reference = $1',
            [reference]
        );

        if (paymentResult.rows.length === 0) {
            // If the payment isn't in our DB, it might be an ad-hoc donation
            // or a payment not initiated via our UI. We should still log it!
            console.warn(`Webhook received for unknown reference: ${reference}`);
            // You might want to handle this differently (e.g., create a new user or log to admin)
            return NextResponse.json({ message: 'Reference not found' }, { status: 404 });
        }

        const payment = paymentResult.rows[0];

        // 2. If already completed, don't do anything
        if (payment.status === 'completed') {
            return NextResponse.json({ message: 'Already processed' });
        }

        // 3. Update Payment record
        await db.query(`
            UPDATE payments 
            SET status = 'completed', 
                completed_at = NOW(),
                metadata = $1
            WHERE reference = $2
        `, [JSON.stringify(data), reference]);

        // 4. Update User Profile
        const tier = payment.donation_tier;
        const donateAmount = parseFloat(amount);
        const userId = payment.user_id;

        if (tier === 'supporter' || tier === 'vip') {
            const expiresAt = payment.is_recurring ? "NOW() + INTERVAL '30 days'" : 'NULL';

            await db.query(`
                UPDATE users
                SET supporter_tier = $1,
                    supporter_since = COALESCE(supporter_since, NOW()),
                    total_donated = COALESCE(total_donated, 0) + $2,
                    supporter_expires_at = ${expiresAt}
                WHERE id = $3
            `, [tier, donateAmount, userId]);
        } else {
            // One-time donation
            await db.query(`
                UPDATE users
                SET total_donated = COALESCE(total_donated, 0) + $1
                WHERE id = $2
            `, [donateAmount, userId]);
        }

        // 5. Success
        console.log(`[Webhook] Successfully processed payment ${reference} for user ${userId}`);

        // Revalidate the dashboard
        revalidatePath('/(dashboard)/account');
        revalidatePath('/(dashboard)/billing');

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}
