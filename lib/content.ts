
import { db } from '@/lib/db';

export async function getContent(key: string, defaultValue: string = ''): Promise<string> {
    try {
        const result = await db.query('SELECT content FROM site_content WHERE key = $1', [key]);
        if (result.rows.length > 0) {
            return result.rows[0].content;
        }
        return defaultValue;
    } catch (error) {
        console.error(`Failed to fetch content for key: ${key}`, error);
        return defaultValue;
    }
}
