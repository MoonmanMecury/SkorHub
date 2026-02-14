
export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto px-4 pt-4 pb-10">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 space-y-6">
                    {/* Header Skeleton */}
                    <div className="flex items-center justify-between">
                        <div className="h-9 w-32 bg-white/5 rounded-lg animate-pulse border border-white/10"></div>
                        <div className="h-6 w-40 bg-white/5 rounded-full animate-pulse border border-white/10"></div>
                    </div>

                    {/* Video Player Skeleton */}
                    <div className="aspect-video bg-[#161618] rounded-2xl animate-pulse border border-primary/10 flex items-center justify-center shadow-2xl">
                        <span className="material-icons text-slate-800 text-7xl">play_circle</span>
                    </div>

                    {/* Controls Skeleton */}
                    <div className="bg-[#161618]/30 border border-white/5 rounded-2xl p-6 space-y-4">
                        <div className="h-4 w-32 bg-white/5 rounded animate-pulse"></div>
                        <div className="grid grid-cols-4 gap-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse"></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Skeleton */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="glass p-5 rounded-2xl border border-white/5 bg-[#161618]/80 shadow-2xl space-y-6">
                        <div className="space-y-2">
                            <div className="h-2 w-20 bg-slate-800 rounded animate-pulse"></div>
                            <div className="h-8 w-full bg-slate-800 rounded animate-pulse"></div>
                            <div className="h-4 w-10 bg-primary/20 rounded animate-pulse"></div>
                            <div className="h-8 w-full bg-slate-800 rounded animate-pulse"></div>
                        </div>
                        <div className="pt-4 border-t border-white/5 space-y-3">
                            <div className="h-3 w-full bg-slate-800 rounded animate-pulse"></div>
                            <div className="h-3 w-full bg-slate-800 rounded animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
