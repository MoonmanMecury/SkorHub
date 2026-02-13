
'use client';

interface VideoPlayerProps {
    streamUrl: string | null;
    streamQuality: string;
    onQualityChange: (quality: string) => void;
    matchTitle?: string;
    isPremium?: boolean;
    posterUrl?: string | null;
}

export default function VideoPlayer({
    streamUrl,
    streamQuality = 'auto',
    onQualityChange,
    matchTitle,
    isPremium = false,
    posterUrl
}: VideoPlayerProps) {

    if (!streamUrl) {
        return (
            <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-primary/20 shadow-2xl shadow-primary/10">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <span className="material-icons text-6xl text-slate-700">videocam_off</span>
                        <p className="text-slate-400 font-bold">No stream selected</p>
                        <p className="text-slate-600 text-sm">Select a server to watch</p>
                    </div>
                </div>
            </div>
        );
    }

    // Modify stream URL based on quality selection
    const getStreamUrlWithQuality = () => {
        if (!streamUrl) return null;

        // For SD quality, append quality parameter to force 480p
        if (streamQuality === 'sd') {
            const separator = streamUrl.includes('?') ? '&' : '?';
            return `${streamUrl}${separator}quality=480p`;
        }

        return streamUrl;
    };

    const finalStreamUrl = getStreamUrlWithQuality();

    return (
        <div
            className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-primary/20 shadow-2xl shadow-primary/10 group"
        >
            {/* IFRAME - Direct Embed */}
            <iframe
                key={`${finalStreamUrl}-${streamQuality}`}
                src={finalStreamUrl || ''}
                className="w-full h-full absolute inset-0"
                allowFullScreen
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                style={{
                    border: 'none',
                    zIndex: 1
                }}
            />


            {/* Premium Badge */}
            {isPremium && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-[#5DD62C] to-emerald-600 px-3 py-1.5 rounded-lg font-black text-[10px] uppercase shadow-lg z-20 pointer-events-none text-black">
                    ⭐ Premium
                </div>
            )}

            {/* Minimalist Controls */}
            <div className="absolute top-4 right-4 flex gap-1 z-20 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                {[
                    { label: 'HD', quality: 'hd', resolution: '1080p' },
                    { label: 'SD', quality: 'sd', resolution: '480p' }
                ].map((option) => (
                    <button
                        key={option.quality}
                        onClick={() => onQualityChange(option.quality)}
                        className={`relative group/btn w-8 h-8 rounded-full font-black text-[8px] flex items-center justify-center backdrop-blur-md transition-all border ${streamQuality === option.quality
                            ? 'bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/30'
                            : 'bg-black/40 border-white/5 text-slate-400 hover:bg-black/60 hover:text-white'
                            }`}
                        title={`${option.label} Quality (${option.resolution})`}
                    >
                        {option.label}
                        {/* Tooltip */}
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/90 text-white px-2 py-1 rounded text-[7px] font-bold whitespace-nowrap opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none">
                            {option.resolution}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
