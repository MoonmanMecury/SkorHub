
// app/api/payment/verify/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import axios from 'axios';
import { revalidatePath } from 'next/cache';

// Since this was a payment verification endpoint in backend/routes/payment.js,
// we map it to an API route for consistency or a Server Action.
// API Routes are easier for "webhooks" or simple REST calls.
export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const userId = session.userId; // Assuming session shape { userId, email }

        // We expect a JSON body with the transaction reference
        const body = await request.json();
        const { reference } = body;

        if (!reference) {
            return NextResponse.json({ message: 'Payment reference is required' }, { status: 400 });
        }

        const client = await db.connect();

        try {
            // 1. Verify with Lenco
            // Using LENCO_API_KEY from .env
            const API_KEY = process.env.LENCO_API_KEY;
            if (!API_KEY) {
                console.error('LENCO_API_KEY missing in environments');
                return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
            }

            const lencoRes = await axios.get(`https://api.lenco.co/access/v2/collections/status/${reference}`, {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Accept': 'application/json'
                }
            });

            const lencoData = lencoRes.data;

            // Lenco API spec: Verify status is successful
            if (!lencoData.status || lencoData.data.status !== 'successful') {
                return NextResponse.json({ message: 'Payment verification failed or pending' }, { status: 400 });
            }

            const paymentInfo = lencoData.data;

            // 2. Database Transaction
            await client.query('BEGIN');

            // Check if payment already recorded
            const existingTx = await client.query('SELECT id FROM payments WHERE reference = $1', [reference]);
            if (existingTx.rowCount && existingTx.rowCount > 0) {
                await client.query('ROLLBACK');
                return NextResponse.json({ message: 'Payment already processed' });
            }

            // 3. Insert Payment Record
            // Determine tier based on amount
            const amount = parseFloat(paymentInfo.amount);
            let tier: string | null = null;
            let isDonation = false;

            if (amount >= 50) {
                tier = 'vip';
                isDonation = true;
            } else if (amount >= 15) {
                tier = 'supporter';
                isDonation = true;
            } else if (amount >= 5) {
                tier = 'one-time';
                isDonation = true;
            }

            await client.query(
                `INSERT INTO payments (
                    user_id, reference, lenco_reference, amount, currency, 
                    status, payment_method, phone_number, metadata,
                    is_donation, donation_tier
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
                [
                    userId,
                    reference,
                    paymentInfo.lencoReference,
                    amount,
                    paymentInfo.currency,
                    paymentInfo.status,
                    paymentInfo.type,
                    paymentInfo.mobileMoneyDetails?.phone || 'N/A',
                    JSON.stringify(paymentInfo),
                    isDonation,
                    tier
                ]
            );

            // 4. Update User Profile (Tier & Stats)
            // If it's a recurring tier (Supporter/VIP), set/extend expiration
            if (tier === 'supporter' || tier === 'vip') {
                const expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + 30);

                await client.query(
                    `UPDATE users 
                     SET supporter_tier = $1,
                         supporter_since = COALESCE(supporter_since, NOW()),
                         supporter_expires_at = $2,
                         total_donated = total_donated + $3
                     WHERE id = $4`,
                    [tier, expiryDate, amount, userId]
                );
            } else {
                // One-time donation - just update total
                await client.query(
                    `UPDATE users 
                     SET total_donated = total_donated + $1
                     WHERE id = $2`,
                    [amount, userId]
                );
            }

            await client.query('COMMIT');

            // Revalidate all dashboard routes
            revalidatePath('/(dashboard)/account', 'page');
            revalidatePath('/(dashboard)/billing', 'page');
            revalidatePath('/support', 'page');

            return NextResponse.json({
                success: true,
                tier: tier,
                totalDonated: amount
            });

        } catch (txError: any) {
            await client.query('ROLLBACK');
            console.error('Lenco Verification Error:', txError.response?.data || txError.message);
            return NextResponse.json({ message: 'Transaction failed', error: txError.message }, { status: 500 });
        } finally {
            client.release();
        }

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
