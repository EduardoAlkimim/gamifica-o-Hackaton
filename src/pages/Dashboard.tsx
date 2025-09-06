import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Award, CheckCircle, Star, Coins, ArrowRight, BookOpen, Store, Spade, QrCode, Tractor, DollarSign } from 'lucide-react';
import { UserData, RankingPlayer, Tab, CollectibleItem } from '../types';
import { MOCK_USER_DATA, MOCK_COLLECTIBLES, DAILY_REWARD_COINS } from '../data';

// --- COMPONENTES AUXILIARES ---

type PlantationProps = {
  level: UserData['plantLevel'];
};
const Plantation = ({ level }: PlantationProps) => {
  const plants = [
    { emoji: "🌱", label: "Semente" }, { emoji: "🌿", label: "Broto" },
    { emoji: "🌾", label: "Plantação" }, { emoji: "🚜", label: "Colheita Completa!" },
  ];
  const currentPlant = plants[level];
  return (
    <div className="plantation-card">
      <motion.div key={level} initial={{ scale: 0.5, y: 50, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="plantation-emoji" >
        {currentPlant.emoji}
      </motion.div>
      <p className="plantation-label">{currentPlant.label}</p>
      <p className="plantation-subtitle">Continue completando missões para crescer!</p>
    </div>
  );
};

type DashboardCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: string;
};
const DashboardCard = ({ icon, title, value, color }: DashboardCardProps) => (
  <div className="dashboard-card">
    <div className="dashboard-card-icon" style={{ backgroundColor: color }}>{icon}</div>
    <div>
      <p className="dashboard-card-title">{title}</p>
      <p className="dashboard-card-value">{value}</p>
    </div>
  </div>
);

type XpProgressBarProps = {
  currentXp: number;
  goalXp: number;
};
const XpProgressBar = ({ currentXp, goalXp }: XpProgressBarProps) => {
  const percentage = goalXp > 0 ? Math.min((currentXp / goalXp) * 100, 100) : 0;
  return (
    <div className="xp-bar-container">
        <p className="xp-bar-title">Progresso de Nível</p>
        <div className="xp-bar-background">
            <motion.div className="xp-bar-progress" initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 0.8, ease: "easeInOut" }}/>
        </div>
        <p className="xp-bar-text">{currentXp} / {goalXp} XP</p>
    </div>
  );
};

type CollectionProps = {
  allItems: CollectibleItem[];
  collectedIds: number[];
};
const Collection = ({ allItems, collectedIds }: CollectionProps) => {
    return (
        <div className="collection-grid">
            {allItems.map(item => {
                const isFound = collectedIds.includes(item.id);
                return (
                    <div key={item.id} className={`collection-item ${isFound ? `collection-item-found ${item.rarity}` : ''}`}>
                        <div className="collection-item-emoji">{isFound ? item.emoji : '❓'}</div>
                        <div className="collection-item-name">{isFound ? item.name : '????'}</div>
                    </div>
                );
            })}
        </div>
    );
};

const Confetti = () => {
    const colors = ["#fde047", "#86efac", "#67e8f9", "#a78bfa"];
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 500 }}>
            {Array.from({ length: 50 }).map((_, i) => (
                <motion.div key={i} style={{ position: 'absolute', borderRadius: '50%', backgroundColor: colors[Math.floor(Math.random() * colors.length)], left: `${Math.random() * 100}%`, top: `-${Math.random() * 20}%`, width: `${Math.random() * 10 + 5}px`, height: `${Math.random() * 10 + 5}px`}}
                    animate={{ y: window.innerHeight + 20, x: Math.random() * 200 - 100, rotate: Math.random() * 360, opacity: 0 }}
                    transition={{ duration: Math.random() * 2 + 3, ease: "linear", delay: Math.random() * 0.5 }}
                />
            ))}
        </div>
    );
};

type DailyRewardModalProps = {
  onClaim: () => void;
};
const DailyRewardModal = ({ onClaim }: DailyRewardModalProps) => (
    <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="modal-content daily-reward-modal" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}>
            <div className="modal-icon">🎁</div>
            <h3 className="modal-title">Recompensa Diária!</h3>
            <p className="modal-text">Bem-vindo de volta! Aqui está um presente por entrar hoje.</p>
            <p className="modal-reward">
                <Coins size={24} style={{ marginRight: '0.5rem' }}/> +{DAILY_REWARD_COINS}
            </p>
            <button className="modal-button" onClick={onClaim}>Coletar!</button>
        </motion.div>
    </motion.div>
);

type ItemFoundModalProps = {
  item: CollectibleItem;
  onClose: () => void;
};
const ItemFoundModal = ({ item, onClose }: ItemFoundModalProps) => (
   <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="modal-content item-found-modal" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}>
            <div className="modal-icon">{item.emoji}</div>
            <h3 className="modal-title">Você encontrou um item!</h3>
            <p className="modal-text">{item.description}</p>
            <p className="item-rarity" style={{color: `var(--rarity-${item.rarity})`}}>{item.rarity}</p>
            <button className="modal-button" onClick={onClose}>Legal!</button>
        </motion.div>
    </motion.div>
);

const cursosFakes = [
    {
        id: 1,
        title: "Empreendedorismo no Agro 4.0",
        description: "Aprenda a inovar e criar negócios de sucesso no campo.",
        icon: <DollarSign size={24} />,
        color: "var(--primary-green)",
        progress: 75,
    },
    {
        id: 2,
        title: "Tecnologia e Sustentabilidade",
        description: "Descubra como a tecnologia pode aumentar a produtividade de forma sustentável.",
        icon: <Tractor size={24} />,
        color: "var(--primary-blue)",
        progress: 30,
    }
];

const CursosSection = () => (
    <section>
        <h2 className="section-title"><BookOpen color="#60a5fa"/> Cursos Disponíveis</h2>
        <div className="cursos-grid">
            {cursosFakes.map(curso => (
                <div key={curso.id} className="curso-card" style={{ borderLeftColor: curso.color }}>
                    <div className="curso-card-header">
                        <div className="curso-card-icon" style={{ backgroundColor: curso.color }}>
                            {curso.icon}
                        </div>
                        <h3 className="curso-card-title">{curso.title}</h3>
                    </div>
                    <p className="curso-card-description">{curso.description}</p>
                    <div className="curso-card-progress">
                        <p>Progresso: {curso.progress}%</p>
                        <div className="progress-bar-background">
                            <div className="progress-bar-fill" style={{ width: `${curso.progress}%`, backgroundColor: curso.color }}></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </section>
);

const lojaFakes = [
    { id: 1, name: "Fertilizante Mágico", description: "Acelera o crescimento da sua planta.", price: 50, icon: '🧪' },
    { id: 2, name: "Trator Novo", description: "Melhora a eficiência da sua fazenda.", price: 200, icon: '🚜' },
    { id: 3, name: "Sementes Raras", description: "Plante algo exótico e valioso.", price: 120, icon: '✨' },
];

type LojaSectionProps = {
    userCoins: number;
    onPurchase: (price: number) => void;
};

const LojaSection = ({ userCoins, onPurchase }: LojaSectionProps) => {
    const handleBuyItem = (itemPrice: number) => {
        if (userCoins >= itemPrice) {
            onPurchase(itemPrice);
            alert("Item comprado com sucesso!");
        } else {
            alert("Moedas insuficientes!");
        }
    };
    
    return (
        <section>
            <div className="loja-header">
                <h2 className="section-title"><Store color="#c084fc"/> Lojinha de Itens</h2>
                <div className="user-coins">
                    <Coins size={20} color="var(--primary-yellow)" />
                    <span>{userCoins}</span>
                </div>
            </div>
            <div className="loja-grid">
                {lojaFakes.map(item => (
                    <div key={item.id} className="loja-item-card">
                        <div className="loja-item-icon">{item.icon}</div>
                        <h3 className="loja-item-name">{item.name}</h3>
                        <p className="loja-item-description">{item.description}</p>
                        <div className="loja-item-footer">
                            <span className="loja-item-price">{item.price} <Coins size={14}/></span>
                            <button onClick={() => handleBuyItem(item.price)} className="loja-item-button">Comprar</button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

type ScannerSectionProps = {
  onScan: (qrId: string) => void;
};
const ScannerSection = ({ onScan }: ScannerSectionProps) => (
    <section className="scanner-section">
         <h2 className="section-title"><QrCode color="#c084fc"/>Ponto de Descoberta</h2>
         <p className="placeholder-text">Aponte sua câmera para um QR Code de Missão de Exploração para desbloquear recompensas especiais!</p>
         <div className="scanner-viewfinder">
             <QrCode size={80} color="rgba(243, 244, 246, 0.2)" />
         </div>
         <button className="scanner-button" onClick={() => onScan('BIBLIO_01')}>
           Simular Leitura (Biblioteca)
         </button>
    </section>
);

// --- COMPONENTE PRINCIPAL DO DASHBOARD ---
const Dashboard = () => {
    // Estados para dados locais/mockados que ainda usamos
    const [userData, setUserData] = useState<UserData>(MOCK_USER_DATA);
    const [activeTab, setActiveTab] = useState<Tab>('fazenda');
    const [showConfetti, setShowConfetti] = useState(false);
    const [showDailyReward, setShowDailyReward] = useState(false);
    const [foundItem, setFoundItem] = useState<CollectibleItem | null>(null);

    // Estados para os dados que vêm da API
    const [profileData, setProfileData] = useState<any>(null);
    const [statusData, setStatusData] = useState<any>(null);
    const [missions, setMissions] = useState<any[]>([]);
    const [ranking, setRanking] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Estado e Ref para o menu de Logout
    const [showLogout, setShowLogout] = useState(false);
    const logoutRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchAllData = async () => {
            const username = localStorage.getItem('username');
            const token = localStorage.getItem('token');

            if (!username || !token) {
                setError("Usuário não autenticado. Faça o login novamente.");
                setIsLoading(false);
                return;
            }

            try {
                const profileUrl = `https://service2.funifier.com/v3/player/${username}`;
                const statusUrl = `https://service2.funifier.com/v3/player/${username}/status`;
                const challengesUrl = `https://service2.funifier.com/v3/challenge`;
                const leaderboardUrl = `https://service2.funifier.com/v3/leaderboard/E6cIhso/leaders`;
                
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                };

                const [profileResponse, statusResponse, challengesResponse, leaderboardResponse] = await Promise.all([
                    fetch(profileUrl, requestOptions),
                    fetch(statusUrl, requestOptions),
                    fetch(challengesUrl, requestOptions),
                    fetch(leaderboardUrl, requestOptions)
                ]);

                if (!profileResponse.ok || !statusResponse.ok || !challengesResponse.ok || !leaderboardResponse.ok) {
                    throw new Error('Não foi possível carregar todos os dados do jogador.');
                }

                const [profileJson, statusJson, challengesJson, leaderboardJson] = await Promise.all([
                    profileResponse.json(),
                    statusResponse.json(),
                    challengesResponse.json(),
                    leaderboardResponse.json()
                ]);

                setProfileData(profileJson);
                setStatusData(statusJson);

                const completedChallenges = statusJson.challenges || {};
                const transformedMissions = challengesJson.map((challenge: any) => ({
                    id: challenge._id,
                    text: challenge.challenge,
                    description: challenge.description,
                    xp: challenge.points[0]?.total || 0,
                    completed: completedChallenges.hasOwnProperty(challenge._id)
                }));
                setMissions(transformedMissions);

                const transformedRanking = leaderboardJson.leaders.map((leader: any) => ({
                    id: leader.player,
                    name: leader.name,
                    xp: leader.total,
                    avatar: leader.image,
                    position: leader.position
                }));
                setRanking(transformedRanking);

            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, []);

    useEffect(() => {
        const today = new Date().toDateString();
        const lastClaimed = localStorage.getItem('dailyRewardLastClaimed');
        if (lastClaimed !== today) {
            setShowDailyReward(true);
        }
    }, []);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (logoutRef.current && !logoutRef.current.contains(event.target as Node)) {
                setShowLogout(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const playSound = (type: 'complete' | 'reward' | 'scan') => {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        if(!audioContext) return;
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        // ... (resto da implementação do som)
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.5);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    };
    
    const handleCompleteMission = async (missionId: string) => { 
        const missionToComplete = missions.find(m => m.id === missionId);
        if (!missionToComplete || missionToComplete.completed) return;

        const originalMissions = missions;
        const originalStatusData = statusData;

        const updatedMissions = missions.map(m => m.id === missionId ? { ...m, completed: true } : m);
        setMissions(updatedMissions);
        setStatusData((prev: any) => ({
            ...prev,
            total_points: prev.total_points + missionToComplete.xp
        }));
        setShowConfetti(true);

        let actionId;
        switch (missionToComplete.xp) {
            case 25: actionId = "ClickEGanhe25xp"; break;
            case 50: actionId = "ClickEGanhe"; break;
            case 75: actionId = "ClickEGanhe75xp"; break;
            case 100: actionId = "ClickEGanhe100xp"; break;
            case 150: actionId = "ClickEGanhe150xp"; break;
            default:
                console.warn(`Nenhum actionId configurado para ${missionToComplete.xp} XP.`);
                return;
        }

        try {
            const token = localStorage.getItem('token');
            const username = localStorage.getItem('username');

            if (!token || !username) throw new Error("Dados de autenticação faltando.");
            
            const logBody = { actionId: actionId, userId: username };

            const response = await fetch(`https://service2.funifier.com/v3/action/log`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(logBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Erro da API Funifier:", errorData);
                throw new Error(`O servidor retornou um erro ${response.status}.`);
            }
            
            console.log(`Log da ação "${actionId}" enviado com sucesso!`);

        } catch (error) {
            console.error("Falha ao registrar ação na API:", error);
            alert("Ops! A API não autorizou esta ação (Erro 401). A mudança na tela será desfeita.");
            
            setMissions(originalMissions);
            setStatusData(originalStatusData);
            setShowConfetti(false);
        }
    };
     
    const handleQrScan = (qrId: string) => { alert(`Lógica para QR Code ${qrId} não implementada.`); };

    const handleClaimDailyReward = () => {
        setUserData(prevData => ({ ...prevData, coins: prevData.coins + DAILY_REWARD_COINS }));
        localStorage.setItem('dailyRewardLastClaimed', new Date().toDateString());
        setShowDailyReward(false);
        playSound('reward');
    };
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.reload();
    };
    
    const handlePurchase = (price: number) => {
        setUserData(prev => ({ ...prev, coins: prev.coins - price }));
    };

    if (isLoading) {
        return <div className="container" style={{textAlign: 'center', paddingTop: '5rem'}}>Carregando Fazendinha...</div>;
    }

    if (error) {
        return <div className="container" style={{textAlign: 'center', paddingTop: '5rem'}}>Erro: {error}</div>;
    }

    return (
        <div className="container">
            <AnimatePresence>
                {showConfetti && <Confetti />}
                {showDailyReward && <DailyRewardModal onClaim={handleClaimDailyReward} />}
                {foundItem && <ItemFoundModal item={foundItem} onClose={() => setFoundItem(null)} />}
            </AnimatePresence>

            <header className="header">
                <div>
                    <h1 className="header-title">Fazendinha do Saber</h1>
                    <p className="header-subtitle">Bem-vindo, {profileData?.name}!</p>
                </div>
                <div className="user-avatar-container" ref={logoutRef}>
                    <div className="user-avatar" onClick={() => setShowLogout(!showLogout)}>
                        {profileData?.image?.small?.url ? (
                            <img 
                                src={profileData.image.small.url} 
                                alt={`Foto de ${profileData.name}`}
                                className="user-avatar-image" 
                            />
                        ) : ( '👤' )}
                    </div>
                    <AnimatePresence>
                        {showLogout && (
                            <motion.button 
                                className="logout-button" 
                                onClick={handleLogout}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                Sair
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </header>

            <main>
                {activeTab === 'fazenda' && (
                    <>
                        <section>
                            <h2 className="section-title"><Leaf color="#4ade80"/>Sua Fazenda</h2>
                            <Plantation level={userData.plantLevel} />
                            <div className="dashboard-grid">
                                <DashboardCard 
                                    icon={<Star size={20} color="#1f2937"/>} 
                                    title="XP Total" 
                                    value={statusData?.total_points ?? 0}
                                    color="#fde047"
                                />
                                <DashboardCard 
                                    icon={<Coins size={20} color="#1f2937"/>} 
                                    title="Moedas" 
                                    value={userData.coins} 
                                    color="#facc15"
                                />
                            </div>
                            <XpProgressBar currentXp={statusData?.total_points ?? 0} goalXp={userData.xpGoal} />
                        </section>
                        <section>
                            <h2 className="section-title"><Spade color="#c084fc"/>Sua Coleção</h2>
                            <Collection allItems={MOCK_COLLECTIBLES} collectedIds={userData.collectedItems} />
                        </section>
                        <section>
                            <h2 className="section-title"><CheckCircle color="#60a5fa"/>Missões do Dia</h2>
                            <div className="missions-list">
                                {missions.map(mission => (
                                    <motion.div key={mission.id} layout className={`mission-card ${mission.completed ? 'mission-card-completed' : ''}`}>
                                        <div className="mission-info">
                                            <div className={`mission-checkbox ${mission.completed ? 'mission-checkbox-completed' : ''}`}>
                                              {mission.completed && <motion.div initial={{scale:0}} animate={{scale:1}}>✓</motion.div>}
                                            </div>
                                            <div>
                                                <p className={`mission-text ${mission.completed ? 'mission-text-completed' : ''}`}>{mission.text}</p>
                                                <p className="mission-description">{mission.description}</p>
                                                <p className="mission-xp">+{mission.xp} XP</p>
                                            </div>
                                        </div>
                                        {!mission.completed && (
                                            <button onClick={() => handleCompleteMission(mission.id)} className="mission-button">
                                                Concluir <ArrowRight size={14}/>
                                            </button>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                        <section>
                            <h2 className="section-title"><Award color="#fde047"/>Ranking da Turma</h2>
                            <div className="ranking-container">
                                {ranking.map(player => (
                                    <div key={player.id} className={`ranking-player ${player.name === profileData?.name ? 'ranking-player-current' : ''}`}>
                                        <span className="ranking-position">{player.position}</span>
                                        <div className="ranking-avatar">
                                            <img 
                                                src={player.avatar} 
                                                alt={player.name}
                                                className="ranking-avatar-image"
                                            />
                                        </div>
                                        <span className="ranking-name">{player.name}</span>
                                        <span className="ranking-xp">{player.xp} XP</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </>
                )}
                
                {activeTab === 'escanear' && <ScannerSection onScan={handleQrScan} />}
                {activeTab === 'cursos' && <CursosSection />}
                {activeTab === 'loja' && <LojaSection userCoins={userData.coins} onPurchase={handlePurchase} />}
            </main>

            <nav className="bottom-nav">
                <button className={`nav-button ${activeTab === 'fazenda' ? 'active' : ''}`} onClick={() => setActiveTab('fazenda')}>
                    <Leaf /> Fazenda
                </button>
                <button className={`nav-button ${activeTab === 'cursos' ? 'active' : ''}`} onClick={() => setActiveTab('cursos')}>
                    <BookOpen /> Cursos
                </button>
                <button className={`nav-button ${activeTab === 'escanear' ? 'active' : ''}`} onClick={() => setActiveTab('escanear')}>
                    <QrCode /> Escanear
                </button>
                <button className={`nav-button ${activeTab === 'loja' ? 'active' : ''}`} onClick={() => setActiveTab('loja')}>
                    <Store /> Loja
                </button>
            </nav>
        </div>
    );
}

export default Dashboard;