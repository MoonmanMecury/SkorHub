
const { Pool } = require('pg');

async function checkSchema() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        console.log("Checking for favorites table...");
        const res = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'favorites'
            );
        `);

        if (res.rows[0].exists) {
            console.log("Table 'favorites' EXISTS.");
            const columns = await pool.query(`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'favorites';
            `);
            console.log("Columns:", columns.rows);
        } else {
            console.log("Table 'favorites' DOES NOT EXIST. Creating it now...");
            await pool.query(`
                CREATE TABLE IF NOT EXISTS favorites (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                    match_id TEXT NOT NULL,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(user_id, match_id)
                );
            `);
            await pool.query('CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);');
            console.log("Table 'favorites' created successfully with index.");
        }
    } catch (err) {
        console.error("Schema check failed:", err);
    } finally {
        await pool.end();
    }
}

checkSchema();
