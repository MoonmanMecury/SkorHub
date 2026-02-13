'use client';

import AdminNavLinks from '@/components/admin/AdminNavLinks';

export default function AdminSidebar() {
    return (
        <aside className="w-64 hidden lg:block border-r border-white/5 h-[calc(100vh-64px)] overflow-y-auto sticky top-16 bg-[#0A0A0B]">
            <div className="p-6">
                <AdminNavLinks />
            </div>
        </aside>
    );
}
