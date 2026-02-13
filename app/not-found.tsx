
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6">
            <div className="max-w-xl w-full text-center relative">
                {/* Large Background Text */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] font-black text-white/[0.02] italic select-none pointer-events-none tracking-tighter">
                    404
                </div>

                <div className="relative z-10 space-y-8">
                    <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto border border-white/10 shadow-2xl">
                        <span className="material-icons text-primary text-5xl">visibility_off</span>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white">Target <span className="text-primary NOT-italic">Not Found</span></h1>
                        <p className="text-slate-400 font-medium max-w-md mx-auto italic">The match or page you're looking for has moved out of range or no longer exists.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link
                            href="/"
                            className="px-10 py-5 bg-white text-black font-black uppercase rounded-2xl text-[10px] tracking-[0.2em] shadow-2xl hover:bg-primary hover:text-white transition-all hover:scale-105 active:scale-95"
                        >
                            Return Home
                        </Link>
                        <Link
                            href="/schedule"
                            className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black uppercase rounded-2xl text-[10px] tracking-[0.2em] hover:bg-white/10 transition-all"
                        >
                            View Schedule
                        </Link>
                    </div>

                    <div className="pt-12">
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">SkorHub • GLOBAL_BROADCAST_NETWORK</p>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -z-10"></div>
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -z-10"></div>
            </div>
        </div>
    );
}
