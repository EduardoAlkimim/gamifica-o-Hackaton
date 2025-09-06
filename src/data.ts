// src/data.ts
import type { UserData, Mission, RankingPlayer, CollectibleItem } from './types';

export const MOCK_USER_DATA: Omit<UserData, 'name'> = {
    xp: 75,
    xpGoal: 200,
    coins: 120,
    plantLevel: 1,
    collectedItems: [1]
};

export const MOCK_MISSIONS: Mission[] = [
    { id: 1, text: "Responder 3 perguntas de matemática", xp: 50, completed: false },
    { id: 2, text: "Assistir vídeo sobre agro", xp: 25, completed: true },
    { id: 5, text: "Vá até a biblioteca e escaneie o Ponto de Descoberta", xp: 150, completed: false, type: 'qr', qrId: 'BIBLIO_01'},
    { id: 3, text: "Fazer quiz de empreendedorismo", xp: 75, completed: false },
    { id: 4, text: "Completar o desafio diário", xp: 100, completed: false },
];

export const MOCK_RANKING: RankingPlayer[] = [
    { id: 1, name: "Maria", xp: 1250, avatar: "👩‍🌾" }, { id: 2, name: "João", xp: 1100, avatar: "🧑‍💻" },
    { id: 3, name: "Ana", xp: 950, avatar: "👩‍🔬" }, { id: 4, name: "Aluno Hackathon", xp: 275, avatar: "🧑‍🚀" },
    { id: 5, name: "Pedro", xp: 150, avatar: "🧑‍🎨" },
];

export const MOCK_COLLECTIBLES: CollectibleItem[] = [
    {id: 1, name: 'Semente Brilhante', emoji: '✨', description: 'Uma semente que pulsa com uma luz suave.', rarity: 'comum'},
    {id: 2, name: 'Gota de Orvalho', emoji: '💧', description: 'Reflete todas as cores do arco-íris.', rarity: 'comum'},
    {id: 3, name: 'Folha de Outono', emoji: '🍂', description: 'Nunca murcha, mantendo sempre suas cores vibrantes.', rarity: 'comum'},
    {id: 4, name: 'Regador de Prata', emoji: '🥈', description: 'Faz qualquer planta crescer mais feliz.', rarity: 'raro'},
    {id: 5, name: 'Abóbora Risonha', emoji: '🎃', description: 'Dizem que ela conta piadas sobre agricultura.', rarity: 'raro'},
    {id: 6, name: 'Trator Dourado', emoji: '🚜', description: 'Um trator lendário que ara os campos do conhecimento.', rarity: 'lendario'},
];

export const DAILY_REWARD_COINS = 50;
export const CHANCE_TO_FIND_ITEM = 0.5;