
const { Pool } = require('pg');
const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

async function verifyPayment(reference) {
    if (!reference) {
        console.error("Please provide a payment reference.");
        process.exit(1);
    }

    const API_KEY = process.env.LENCO_API_KEY;
    if (!API_KEY) {
        console.error("LENCO_API_KEY is missing in .env.local");
        process.exit(1);
    }

    console.log(`--- Verifying Reference: ${reference} ---`);

    try {
        const response = await axios.get(`https://api.lenco.co/access/v2/collections/status/${reference}`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Accept': 'application/json'
            }
        });

        const lencoData = response.data;
        console.log("Lenco API Response:", JSON.stringify(lencoData, null, 2));

        if (lencoData.status && lencoData.data.status === 'successful') {
            console.log("\n✅ Payment verified successfully!");
            console.log(`Amount: ${lencoData.data.amount} ${lencoData.data.currency}`);
            console.log(`Type: ${lencoData.data.type}`);

            // Optional: Sync with DB
            const pool = new Pool({ connectionString: process.env.DATABASE_URL });
            const check = await pool.query('SELECT id FROM payments WHERE reference = $1', [reference]);

            if (check.rows.length > 0) {
                console.log("ℹ️ Transaction already exists in database.");
            } else {
                console.log("⚠️ Transaction NOT found in database. You may need to trigger the verification API or run a manual sync.");
            }
            await pool.end();
        } else {
            console.log("\n❌ Payment failed or is still pending.");
            console.log(`Status: ${lencoData.data?.status || 'Unknown'}`);
        }

    } catch (error) {
        console.error("\n💥 Error communicating with Lenco:");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

const ref = process.argv[2];
verifyPayment(ref);
