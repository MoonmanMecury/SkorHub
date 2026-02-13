'use client';

import { useState } from 'react';
import { toggleUserBan } from '@/app/actions/admin';
import { useRouter } from 'next/navigation';
import ManualActivationDialog from '@/components/admin/ManualActivationDialog';

export default function UserActionsPanel({ user }: { user: any }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const router = useRouter();

    const handleBanToggle = async () => {
        if (!confirm(`Are you sure you want to ${user.is_active ? 'BAN' : 'UNBAN'} this user?`)) return;

        setIsProcessing(true);
        try {
            const result = await toggleUserBan(user.id, user.is_active);
            if (result.success) {
                router.refresh();
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error(error);
            alert('Action failed');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 h-fit space-y-6">
            <h3 className="text-lg font-bold text-white mb-4">Admin Actions</h3>

            <div className="space-y-3">
                <button
                    onClick={() => setIsDialogOpen(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors"
                >
                    <span className="material-icons">verified_user</span>
                    Manual Tier Activation
                </button>

                <button
                    onClick={handleBanToggle}
                    disabled={isProcessing}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border font-bold transition-colors ${user.is_active
                        ? 'border-red-500/20 text-red-500 hover:bg-red-500/10'
                        : 'border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10'
                        }`}
                >
                    <span className="material-icons">{user.is_active ? 'block' : 'check_circle'}</span>
                    {user.is_active ? 'Ban User' : 'Unban User'}
                </button>
            </div>

            {isDialogOpen && (
                <ManualActivationDialog
                    userId={user.id}
                    onClose={() => setIsDialogOpen(false)}
                />
            )}
        </div>
    );
}
