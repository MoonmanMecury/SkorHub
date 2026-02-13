
import { Pool } from 'pg';

// Using Supabase pg connection.
// Note: In Next.js with hot reload, caching the client is important to avoid 'too many clients' errors.
// Global interface to store the connection during development
const globalForPg = global as unknown as { pgPool: Pool };

export const db = globalForPg.pgPool || new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Required for Supabase typical pooling connections
    }
});

if (process.env.NODE_ENV !== 'production') globalForPg.pgPool = db;

// Basic query helper if needed
export const query = (text: string, params?: any[]) => db.query(text, params);
