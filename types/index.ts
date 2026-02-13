
export interface Match {
    id: string;
    title: string;
    date: number; // Timestamp
    poster: string;
    popular: boolean;
    sources: Source[];
    teams: {
        home: Team;
        away: Team;
    };
    sportCategory: string; // "football", "basketball", etc.
    live: boolean;
}

export interface Source {
    source: string;
    id: string;
    label?: string;
    quality?: string;
}

export interface Team {
    name: string;
    badge?: string; // URL to logo
}

export interface Stream {
    id: string;
    stream: string; // The stream URL (m3u8, etc.)
    headers?: Record<string, string>;
}

export interface Sport {
    id: string;
    name: string;
    icon: string; // Material icon name;
}

export interface User {
    id: string;
    email: string;
    created_at: string;
    premium?: boolean;
    premium_expires?: string;
    supporter_tier?: 'supporter' | 'vip' | null;
    supporter_since?: string;
    supporter_expires_at?: string;
    total_donated?: number;
}
