
const { Pool } = require('pg');

async function checkUsersTable() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        console.log("Checking columns for 'users' table...");
        const columns = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'users';
        `);
        console.log("Columns:", JSON.stringify(columns.rows, null, 2));
    } catch (err) {
        console.error("Check failed:", err);
    } finally {
        await pool.end();
    }
}

checkUsersTable();
