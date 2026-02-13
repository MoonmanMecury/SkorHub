'use client';

import { useState } from 'react';
import { updateFeedbackStatus } from '@/app/actions/feedback';
import { useRouter } from 'next/navigation';

export default function FeedbackActionDialog({
    feedback,
    onClose
}: {
    feedback: any,
    onClose: () => void
}) {
    const [status, setStatus] = useState(feedback.status || 'new');
    const [note, setNote] = useState(feedback.admin_notes || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await updateFeedbackStatus(feedback.id, status, note);
            router.refresh();
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to update feedback');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-[#1A1A1D] border border-amber-500/20 rounded-xl w-full max-w-lg shadow-2xl p-6 space-y-6 z-10">

                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="material-icons text-amber-500">rate_review</span>
                        Feedback Action
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <span className="material-icons">close</span>
                    </button>
                </div>

                <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-slate-300 italic text-sm">"{feedback.message}"</p>
                    <div className="mt-2 text-xs text-slate-500 flex justify-between">
                        <span>Submitted by: {feedback.public_display_name || feedback.email || 'Anonymous'}</span>
                        <span>{new Date(feedback.created_at).toLocaleDateString()}</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Update Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full bg-[#121214] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500/50"
                        >
                            <option value="new">New</option>
                            <option value="investigating">Investigating</option>
                            <option value="resolved">Resolved</option>
                            <option value="ignored">Ignored</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Admin Note (Internal)</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full bg-[#121214] border border-white/10 rounded-lg px-3 py-2 text-white h-24 resize-none focus:outline-none focus:border-amber-500/50"
                            placeholder="Add internal notes about potential fix or response..."
                        />
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
                                    Update Status
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
