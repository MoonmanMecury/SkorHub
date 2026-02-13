'use client';

import { useState } from 'react';
import ContentEditorDialog from '@/components/admin/ContentEditorDialog';

export default function ContentTable({ items }: { items: any[] }) {
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleEdit = (item: any) => {
        setSelectedItem(item);
        setIsDialogOpen(true);
    };

    const handleNew = () => {
        setSelectedItem(null);
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <button
                    onClick={handleNew}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition-colors"
                >
                    <span className="material-icons">add</span>
                    Add Content Key
                </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/5 shadow-2xl bg-[#0A0A0B]">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-[#1A1A1D] text-slate-200 uppercase font-bold text-xs border-b border-white/5">
                        <tr>
                            <th className="px-6 py-4 whitespace-nowrap">Key (ID)</th>
                            <th className="px-6 py-4 whitespace-nowrap">Current Content</th>
                            <th className="px-6 py-4 whitespace-nowrap">Description</th>
                            <th className="px-6 py-4 whitespace-nowrap">Last Updated</th>
                            <th className="px-6 py-4 text-right whitespace-nowrap">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-[#121214]">
                        {items.map((item) => (
                            <tr key={item.key} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4 font-mono text-xs text-amber-500 font-bold">
                                    {item.key}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="line-clamp-2 max-w-xs text-white">
                                        {item.content}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-xs italic">
                                    {item.description || '-'}
                                </td>
                                <td className="px-6 py-4 text-xs">
                                    {new Date(item.updated_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        <span className="material-icons text-sm">edit</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {items.length === 0 && (
                    <div className="p-12 text-center text-slate-500 border-t-0 border-white/5 rounded-b-xl bg-[#121214]">
                        <span className="material-icons text-4xl mb-2 text-slate-600">article</span>
                        <p>No editable content found.</p>
                    </div>
                )}
            </div>

            {isDialogOpen && (
                <ContentEditorDialog
                    initialKey={selectedItem?.key || ''}
                    initialContent={selectedItem?.content || ''}
                    description={selectedItem?.description || ''}
                    onClose={() => setIsDialogOpen(false)}
                />
            )}
        </div>
    );
}
