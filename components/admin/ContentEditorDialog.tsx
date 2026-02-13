'use client';

import { useState } from 'react';
import { updateSiteContent } from '@/app/actions/content';
import { useRouter } from 'next/navigation';

export default function ContentEditorDialog({
    initialKey,
    initialContent,
    description,
    onClose
}: {
    initialKey: string,
    initialContent: string,
    description?: string,
    onClose: () => void
}) {
    const [key, setKey] = useState(initialKey);
    const [content, setContent] = useState(initialContent);
    const [desc, setDesc] = useState(description);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const isNew = !initialKey;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await updateSiteContent(key, content, desc);
            router.refresh();
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to save content');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-[#1A1A1D] border border-amber-500/20 rounded-xl w-full max-w-2xl shadow-2xl p-6 space-y-6 z-10 max-h-[90vh] overflow-y-auto">

                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="material-icons text-amber-500">edit_document</span>
                        {isNew ? 'Add New Content' : 'Edit Content'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <span className="material-icons">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Content Key (Unique ID)</label>
                            <input
                                type="text"
                                value={key}
                                onChange={(e) => setKey(e.target.value)}
                                disabled={!isNew}
                                className={`w-full bg-[#121214] border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-amber-500/50 ${!isNew ? 'opacity-50 cursor-not-allowed' : ''}`}
                                placeholder="e.g. home_hero_title"
                            />
                            {!isNew && <p className="text-xs text-slate-500">Key cannot be changed once created.</p>}
                            {isNew && <p className="text-xs text-amber-500">Use a unique key (snake_case).</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Description (Internal)</label>
                            <input
                                type="text"
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                                className="w-full bg-[#121214] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500/50"
                                placeholder="Where does this appear?"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Content Text</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full bg-[#121214] border border-white/10 rounded-lg px-3 py-2 text-white h-48 resize-none font-mono text-sm focus:outline-none focus:border-amber-500/50"
                            placeholder="Enter the text content here..."
                        />
                        <p className="text-xs text-slate-500">This text will be injected into the site where the key is used.</p>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-white/5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 rounded-lg text-sm font-bold bg-amber-500 text-black hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="material-icons text-sm animate-spin">refresh</span>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <span className="material-icons text-sm">save</span>
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
