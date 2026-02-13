// app/api/support/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import axios from 'axios';

/**
 * Verify supporter donation payment
 * POST /api/support/verify
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { reference } = body;

        if (!reference) {
            return NextResponse.json(
                { error: 'Reference is required' },
                { status: 400 }
            );
        }

        // Verify authentication
        const token = request.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const payload = await verifyToken(token);
        if (!payload) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }

        // Get payment from database
        const paymentResult = await db.query(
            'SELECT * FROM payments WHERE reference = $1 AND user_id = $2',
            [reference, payload.userId]
        );

        if (paymentResult.rows.length === 0) {
            return NextResponse.json(
                { error: 'Payment not found' },
                { status: 404 }
            );
        }

        const payment = paymentResult.rows[0];

        // If already completed, return success
        if (payment.status === 'completed') {
            return NextResponse.json({
                success: true,
                message: 'Payment already verified',
                tier: payment.donation_tier,
            });
        }

        // Verify with Lenco API
        const lencoApiKey = process.env.LENCO_API_KEY;
        const lencoBaseUrl = process.env.LENCO_API_BASE_URL || 'https://api.lenco.co/access/v2';

        if (!lencoApiKey) {
            console.error('LENCO_API_KEY not configured');
            return NextResponse.json(
                { error: 'Payment gateway not configured' },
                { status: 500 }
            );
        }

        try {
            const verifyResponse = await axios.get(
                `${lencoBaseUrl}/transactions/verify/${reference}`,
                {
                    headers: {
                        'Authorization': `Bearer ${lencoApiKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const lencoData = verifyResponse.data;

            if (lencoData.status === 'success' && lencoData.data?.status === 'successful') {
                // Payment successful - update database
                await db.query(`
          UPDATE payments
          SET 
            status = 'completed',
            lenco_reference = $1,
            completed_at = NOW()
          WHERE reference = $2
        `, [lencoData.data.reference || reference, reference]);

                // Update user's supporter tier
                const tier = payment.donation_tier;
                const amount = parseFloat(payment.amount);

                if (tier === 'supporter' || tier === 'vip') {
                    // Recurring supporter - set expiry to 30 days from now
                    const expiresAt = payment.is_recurring ? "NOW() + INTERVAL '30 days'" : 'NULL';

                    await db.query(`
            UPDATE users
            SET 
              supporter_tier = $1,
              supporter_since = COALESCE(supporter_since, NOW()),
              total_donated = COALESCE(total_donated, 0) + $2,
              supporter_expires_at = ${expiresAt}
            WHERE id = $3
          `, [tier, amount, payload.userId]);

                } else if (tier === 'one-time') {
                    // One-time donation - give 7-day trial of supporter perks
                    await db.query(`
            UPDATE users
            SET 
              supporter_tier = 'supporter',
              supporter_since = COALESCE(supporter_since, NOW()),
              total_donated = COALESCE(total_donated, 0) + $1,
              supporter_expires_at = NOW() + INTERVAL '7 days'
            WHERE id = $2
          `, [amount, payload.userId]);
                }

                // Removed supporter_acknowledgments logic as it's now handled by users table and view

                return NextResponse.json({
                    success: true,
                    message: 'Donation verified successfully',
                    tier: tier,
                    amount: amount,
                });

            } else {
                // Payment failed or pending
                await db.query(
                    'UPDATE payments SET status = $1 WHERE reference = $2',
                    [lencoData.data?.status || 'failed', reference]
                );

                return NextResponse.json(
                    { error: 'Payment verification failed', status: lencoData.data?.status },
                    { status: 400 }
                );
            }

        } catch (lencoError: any) {
            console.error('Lenco API Error:', lencoError.response?.data || lencoError.message);
            return NextResponse.json(
                { error: 'Failed to verify with payment gateway' },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('Donation Verification Error:', error);
        return NextResponse.json(
            { error: 'Failed to verify donation' },
            { status: 500 }
        );
    }
}
