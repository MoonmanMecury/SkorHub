
import { db } from '@/lib/db';
import AdminSearch from '@/components/admin/AdminSearch';
import ContentTable from '@/components/admin/ContentTable';

export default async function ContentPage({ searchParams }: { searchParams: { q?: string } }) {
    const q = searchParams?.q || '';

    let query = `SELECT * FROM site_content WHERE 1=1`;
    const params: any[] = [];

    if (q) {
        query += ` AND (key ILIKE $1 OR description ILIKE $2 OR content ILIKE $3)`;
        params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }

    query += ` ORDER BY key ASC`;

    // Fetch Data
    let items: any[] = [];
    try {
        items = (await db.query(query, params)).rows;
    } catch (e) {
        console.error('Error fetching site content:', e);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Site Content Editor</h1>
                    <p className="text-slate-400 text-sm">Update text across the platform without coding.</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 bg-[#121214] p-4 rounded-xl border border-white/5">
                <AdminSearch placeholder="Search content keys or text..." />
            </div>

            <ContentTable items={items} />
        </div>
    );
}
