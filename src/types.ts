// src/types.ts
export type UserData = {
    name: string;
    xp: number;
    xpGoal: number;
    coins: number;
    plantLevel: 0 | 1 | 2 | 3;
    collectedItems: number[];
};

export type Mission = {
    id: number;
    text: string;
    xp: number;
    completed: boolean;
    type?: 'qr';
    qrId?: string;
};

// src/types.ts

export type RankingPlayer = {
    id: number | string;
    name: string;
    xp: number;
    avatar: string;
    position: number; // <--- CORRIGIDO para number
};

export type Tab = 'fazenda' | 'cursos' | 'escanear' | 'loja';

export type Rarity = 'comum' | 'raro' | 'lendario';

export type CollectibleItem = {
    id: number;
    name: string;
    emoji: string;
    description: string;
    rarity: Rarity;
};