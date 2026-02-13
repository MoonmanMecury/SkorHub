
import { db } from '@/lib/db';
import AdminSearch from '@/components/admin/AdminSearch';
import FeedbackList from '@/components/admin/FeedbackList';

export default async function FeedbackPage({ searchParams }: { searchParams: { q?: string, type?: string } }) {
    const q = searchParams?.q || '';
    const type = searchParams?.type || 'all';

    let query = `
        SELECT f.*, u.email, u.public_display_name 
        FROM feedback f
        LEFT JOIN users u ON f.user_id = u.id
        WHERE 1=1
    `;
    const params: any[] = [];

    if (q) {
        query += ` AND (f.message ILIKE $${params.length + 1} OR u.email ILIKE $${params.length + 2})`;
        params.push(`%${q}%`, `%${q}%`);
    }

    if (type !== 'all') {
        const statuses = ['new', 'investigating', 'resolved', 'ignored'];
        if (statuses.includes(type)) {
            query += ` AND f.status = $${params.length + 1}`;
        } else {
            query += ` AND f.type = $${params.length + 1}`;
        }
        params.push(type);
    }

    query += ` ORDER BY f.created_at DESC LIMIT 50`;

    // Fetch Data
    let items: any[] = [];
    try {
        items = (await db.query(query, params)).rows;
    } catch (e) {
        console.error('Error fetching feedback:', e);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Feedback Inbox</h1>
                    <p className="text-slate-400 text-sm">User bug reports and suggestions.</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 bg-[#121214] p-4 rounded-xl border border-white/5">
                <AdminSearch placeholder="Search feedback message..." />

                <div className="flex items-center space-x-2 text-sm overflow-x-auto pb-1 md:pb-0">
                    <FilterLink value="all" current={type} label="All" />
                    <FilterLink value="new" current={type} label="Unread" />
                    <FilterLink value="bug" current={type} label="Bugs" />
                    <FilterLink value="feature" current={type} label="Features" />
                </div>
            </div>

            <FeedbackList items={items} />
        </div>
    );
}

function FilterLink({ value, current, label }: { value: string, current: string, label: string }) {
    const isActive = value === current;
    return (
        <a
            href={`/admin/feedback?type=${value}`}
            className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-colors ${isActive
                    ? 'bg-amber-500 text-black border-amber-500 font-bold'
                    : 'border-white/10 text-slate-400 hover:text-white bg-white/5'
                }`}
        >
            {label}
        </a>
    );
}
