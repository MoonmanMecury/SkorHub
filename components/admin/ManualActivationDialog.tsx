'use client';

import { useState } from 'react';
import { manualSubscriptionOverride } from '@/app/actions/admin';
import { useRouter } from 'next/navigation';

export default function ManualActivationDialog({ userId, onClose }: { userId: string, onClose: () => void }) {
    const [tier, setTier] = useState('supporter');
    const [duration, setDuration] = useState('30');
    const [notes, setNotes] = useState('');
    const [amount, setAmount] = useState('15');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('tier', tier);
        formData.append('days', duration);
        formData.append('notes', notes);
        formData.append('amount', amount);

        try {
            const result = await manualSubscriptionOverride(formData);
            if (result.success) {
                onClose();
                router.refresh();
            } else {
                alert(result.message || 'Failed to activate subscription');
            }
        } catch (error) {
            console.error(error);
            alert('An unexpected error occurred');
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
                        <span className="material-icons text-amber-500">volunteer_activism</span>
                        Manual Activation
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <span className="material-icons">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Tier Level</label>
                            <select
                                value={tier}
                                onChange={(e) => setTier(e.target.value)}
                                className="w-full bg-[#121214] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500/50"
                            >
                                <option value="supporter">Supporter (K15)</option>
                                <option value="vip">VIP (K30)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Duration (Days)</label>
                            <select
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="w-full bg-[#121214] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500/50"
                            >
                                <option value="7">7 Days (Trial)</option>
                                <option value="30">30 Days (Month)</option>
                                <option value="90">90 Days (Quarter)</option>
                                <option value="365">365 Days (Year)</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Amount Collected (K)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-[#121214] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500/50"
                            placeholder="Enter amount manually paid"
                        />
                        <p className="text-xs text-slate-500">Only for reporting. Does not charge user.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Admin Notes</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full bg-[#121214] border border-white/10 rounded-lg px-3 py-2 text-white h-24 resize-none focus:outline-none focus:border-amber-500/50"
                            placeholder="Reason for manual override (e.g. Paid via mobile money reference #12345)"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
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
                            {isSubmitting && <span className="material-icons text-sm animate-spin">refresh</span>}
                            Activate Tier
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
