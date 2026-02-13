// app/api/support/donate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

const TIER_PRICES = {
    'one-time': { min: 10, max: 1000 },
    'supporter': 15,
    'vip': 30,
};

/**
 * Initialize a supporter donation
 * POST /api/support/donate
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { tier, amount, isRecurring = false } = body;

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

        // Validate tier and amount
        if (!tier || !['one-time', 'supporter', 'vip'].includes(tier)) {
            return NextResponse.json(
                { error: 'Invalid tier' },
                { status: 400 }
            );
        }

        // Validate amount
        let validatedAmount: number;
        if (tier === 'one-time') {
            validatedAmount = parseFloat(amount);
            if (isNaN(validatedAmount) || validatedAmount < TIER_PRICES['one-time'].min || validatedAmount > TIER_PRICES['one-time'].max) {
                return NextResponse.json(
                    { error: `One-time donations must be between K${TIER_PRICES['one-time'].min} and K${TIER_PRICES['one-time'].max}` },
                    { status: 400 }
                );
            }
        } else {
            validatedAmount = TIER_PRICES[tier as 'supporter' | 'vip'];
        }

        // Get user info
        const userResult = await db.query(
            'SELECT id, email FROM users WHERE id = $1',
            [payload.userId]
        );

        if (userResult.rows.length === 0) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const user = userResult.rows[0];

        // Generate reference
        const reference = `SK-${tier.toUpperCase()}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

        // Create payment record
        await db.query(`
      INSERT INTO payments (
        user_id,
        reference,
        amount,
        currency,
        status,
        payment_method,
        is_donation,
        donation_tier,
        is_recurring,
        donation_type,
        initiated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
    `, [
            user.id,
            reference,
            validatedAmount,
            'ZMW',
            'pending',
            'lenco',
            true, // is_donation
            tier,
            isRecurring,
            isRecurring ? 'monthly' : 'one-time',
        ]);

        return NextResponse.json({
            success: true,
            reference,
            amount: validatedAmount,
            tier,
            email: user.email,
        });

    } catch (error) {
        console.error('Donation Initialization Error:', error);
        return NextResponse.json(
            { error: 'Failed to initialize donation' },
            { status: 500 }
        );
    }
}
