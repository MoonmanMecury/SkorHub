'use client';

import { useState } from 'react';
import FeedbackActionDialog from '@/components/admin/FeedbackActionDialog';

export default function FeedbackList({ items }: { items: any[] }) {
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleAction = (item: any) => {
        setSelectedItem(item);
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-4">
            <div className="overflow-x-auto rounded-xl border border-white/5 shadow-2xl bg-[#0A0A0B]">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-[#1A1A1D] text-slate-200 uppercase font-bold text-xs border-b border-white/5">
                        <tr>
                            <th className="px-6 py-4 whitespace-nowrap">Type</th>
                            <th className="px-6 py-4 whitespace-nowrap">Message</th>
                            <th className="px-6 py-4 whitespace-nowrap">User</th>
                            <th className="px-6 py-4 whitespace-nowrap">Status</th>
                            <th className="px-6 py-4 whitespace-nowrap">Date</th>
                            <th className="px-6 py-4 text-right whitespace-nowrap">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-[#121214]">
                        {items.map((item) => (
                            <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4 align-top">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase ${item.type === 'bug' ? 'bg-red-500/10 text-red-500' :
                                            item.type === 'feature' ? 'bg-blue-500/10 text-blue-500' :
                                                'bg-slate-500/10 text-slate-500'
                                        }`}>
                                        {item.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 align-top">
                                    <div className="line-clamp-2 max-w-xs text-white break-words">
                                        {item.message}
                                    </div>
                                    {item.admin_notes && (
                                        <div className="mt-2 p-2 bg-amber-500/5 border border-amber-500/10 rounded-md text-[10px] text-amber-500/80">
                                            <span className="font-bold uppercase tracking-wide">Note:</span> {item.admin_notes}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-xs align-top">
                                    <div className="font-medium text-slate-300">{item.public_display_name || 'Anonymous'}</div>
                                    <div className="text-slate-600 truncate max-w-[150px]">{item.email}</div>
                                </td>
                                <td className="px-6 py-4 align-top">
                                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/10 ${item.status === 'resolved' ? 'text-green-500 border-green-500/20 bg-green-500/5' :
                                            item.status === 'investigating' ? 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5' :
                                                item.status === 'new' ? 'text-blue-400 font-bold border-blue-500/20 bg-blue-500/5' : 'text-slate-600'
                                        }`}>
                                        <span className={`material-icons text-[10px] ${item.status === 'new' ? 'animate-pulse' : ''}`}>circle</span>
                                        <span className="capitalize text-xs font-bold">{item.status}</span>
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-xs align-top">
                                    {new Date(item.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right align-top">
                                    <button
                                        onClick={() => handleAction(item)}
                                        className="text-amber-500 hover:text-amber-400 font-bold text-xs uppercase hover:underline p-2"
                                    >
                                        Update
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {items.length === 0 && (
                    <div className="p-12 text-center text-slate-500 border-t-0 border-white/5 rounded-b-xl bg-[#121214]">
                        <span className="material-icons text-4xl mb-2 text-slate-600">inbox</span>
                        <p>No feedback messages found.</p>
                    </div>
                )}
            </div>

            {isDialogOpen && selectedItem && (
                <FeedbackActionDialog
                    feedback={selectedItem}
                    onClose={() => setIsDialogOpen(false)}
                />
            )}
        </div>
    );
}
