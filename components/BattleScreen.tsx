import React, { useEffect, useState, useRef } from 'react';
import { BattleState, GameAction, MonsterInstance, MonsterType } from '../game/types';
import BattleArena from './BattleArena';
import { chooseOpponentAbility } from '../game/battleLogic';

interface BattleScreenProps {
    battleState: BattleState;
    playerMonsters: MonsterInstance[];
    dispatch: React.Dispatch<GameAction>;
}

// --- Audio Playback System ---
const SOUNDS = {
    [MonsterType.FIRE]: 'https://cdn.pixabay.com/audio/2022/03/15/audio_7020e96f1d.mp3',
    [MonsterType.WATER]: 'https://cdn.pixabay.com/audio/2022/10/27/audio_806544a622.mp3',
    [MonsterType.GRASS]: 'https://cdn.pixabay.com/audio/2021/08/04/audio_142fd7570a.mp3',
    [MonsterType.POISON]: 'https://cdn.pixabay.com/audio/2022/11/22/audio_2917f6920f.mp3',
    [MonsterType.NORMAL]: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c3ff069837.mp3',
    [MonsterType.FLYING]: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c3ff069837.mp3',
    [MonsterType.ELECTRIC]: 'https://cdn.pixabay.com/audio/2021/08/04/audio_36bdb24a29.mp3',
    HIT: 'https://cdn.pixabay.com/audio/2022/01/18/audio_8db129282a.mp3',
    FAINT: 'https://cdn.pixabay.com/audio/2022/07/16/audio_29a1a8c541.mp3',
    VICTORY: 'https://cdn.pixabay.com/audio/2022/08/23/audio_878051e978.mp3',
};

const audioCache: { [key: string]: HTMLAudioElement } = {};
const playSound = (sound: keyof typeof SOUNDS | MonsterType, volume: number = 0.4) => {
    const src = SOUNDS[sound as keyof typeof SOUNDS];
    if (!src) return;
    try {
        let audio = audioCache[src];
        if (!audio) {
            audio = new Audio(src);
            audioCache[src] = audio;
        }
        audio.currentTime = 0;
        audio.volume = volume;
        audio.play().catch(() => {}); // Silently catch autoplay errors
    } catch (e) {
        console.warn("Could not play audio:", e);
    }
};
// --- End Audio System ---

const isPhysicalAttack = (type: MonsterType) => type === MonsterType.NORMAL;

const BattleScreen: React.FC<BattleScreenProps> = ({ battleState, playerMonsters, dispatch }) => {
    const { playerMonster, opponentMonster, turn, log } = battleState;
    const [currentLog, setCurrentLog] = useState<string[]>([]);
    const [showActions, setShowActions] = useState(true);
    const [effects, setEffects] = useState({ player: '', opponent: '' });
    const [attackEffect, setAttackEffect] = useState<{ origin: 'player' | 'opponent' | null, type: MonsterType | null }>({ origin: null, type: null });
    
    // Refs to track previous HP for faint detection
    const opponentHpRef = useRef(opponentMonster.currentHp);
    const playerHpRef = useRef(playerMonster.currentHp);

    const isPlayerMonsterFainted = playerMonster.currentHp <= 0;

    useEffect(() => {
        setCurrentLog(log.slice(-3)); // Show last 3 log entries
    }, [log]);

    // Effect to detect when a monster faints
    useEffect(() => {
        if (opponentHpRef.current > 0 && opponentMonster.currentHp <= 0) {
            playSound('FAINT');
        }
        opponentHpRef.current = opponentMonster.currentHp;
    }, [opponentMonster.currentHp]);

    useEffect(() => {
        if (playerHpRef.current > 0 && playerMonster.currentHp <= 0) {
            playSound('FAINT');
        }
        playerHpRef.current = playerMonster.currentHp;
    }, [playerMonster.currentHp]);
    
    useEffect(() => {
        if (turn === 'OPPONENT') {
            const timer = setTimeout(() => {
                const opponentAbility = chooseOpponentAbility(opponentMonster, playerMonster);
                playSound(opponentAbility.type);
                
                if (isPhysicalAttack(opponentAbility.type)) {
                    setEffects({ player: '', opponent: 'lunge-opponent' });
                    setTimeout(() => {
                        setEffects({ player: 'take-damage', opponent: '' });
                        playSound('HIT', 0.5);
                    }, 400);
                    setTimeout(() => {
                        setEffects({ player: '', opponent: '' });
                        dispatch({ type: 'OPPONENT_ATTACK' });
                    }, 1000);
                } else {
                    setEffects({ player: '', opponent: 'cast-special' });
                    setAttackEffect({ origin: 'opponent', type: opponentAbility.type });
                    setTimeout(() => {
                        setEffects({ player: 'take-damage', opponent: '' });
                        playSound('HIT', 0.5);
                    }, 600);
                    setTimeout(() => {
                        setEffects({ player: '', opponent: '' });
                        setAttackEffect({ origin: null, type: null });
                        dispatch({ type: 'OPPONENT_ATTACK' });
                    }, 1200);
                }
            }, 1500);
            return () => clearTimeout(timer);
        }
        if (turn === 'ENDED') {
            const hasPlayerLost = playerMonsters.every(m => m.currentHp <= 0);
            const timer = setTimeout(() => {
                if (opponentMonster.currentHp <= 0) {
                     playSound('VICTORY', 0.5);
                     dispatch({ type: 'BATTLE_VICTORY' });
                } else if (hasPlayerLost) {
                    dispatch({ type: 'BATTLE_DEFEAT' });
                } else {
                     dispatch({ type: 'RETURN_TO_MENU' });
                }
            }, 2000);
            return () => clearTimeout(timer);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [turn, dispatch]);

    const handleAbilityClick = (ability: typeof playerMonster.abilities[0]) => {
        setShowActions(true);
        playSound(ability.type);
        
        if (isPhysicalAttack(ability.type)) {
            setEffects({ player: 'lunge-player', opponent: '' });
            setTimeout(() => {
                setEffects({ player: '', opponent: 'take-damage' });
                playSound('HIT', 0.5);
            }, 400);
            setTimeout(() => {
                setEffects({ player: '', opponent: '' });
                dispatch({ type: 'PLAYER_ATTACK', payload: ability });
            }, 1000);
        } else {
            setEffects({ player: 'cast-special', opponent: '' });
            setAttackEffect({ origin: 'player', type: ability.type });
            setTimeout(() => {
                setEffects({ player: '', opponent: 'take-damage' });
                playSound('HIT', 0.5);
            }, 600);
            setTimeout(() => {
                setEffects({ player: '', opponent: '' });
                setAttackEffect({ origin: null, type: null });
                dispatch({ type: 'PLAYER_ATTACK', payload: ability });
            }, 1200);
        }
    };

    const handleItemClick = () => {
        dispatch({ type: 'USE_POTION' });
        setShowActions(true);
    };
    
    const handleCatchClick = () => {
        dispatch({ type: 'ATTEMPT_CATCH' });
        setShowActions(true);
    };

    const handleSwitchClick = (instanceId: string) => {
        dispatch({ type: 'SWITCH_ACTIVE_MONSTER_IN_BATTLE', payload: instanceId });
    }
    
    const renderActionButtons = () => (
        <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setShowActions(false)} className="bg-red-600 hover:bg-red-700 p-4 rounded font-bold">Fight</button>
            <button onClick={handleItemClick} className="bg-blue-600 hover:bg-blue-700 p-4 rounded font-bold">Item</button>
            <button onClick={handleCatchClick} className="bg-yellow-500 hover:bg-yellow-600 p-4 rounded font-bold">Catch</button>
            <button onClick={() => dispatch({ type: 'BATTLE_DEFEAT' })} className="bg-gray-500 hover:bg-gray-600 p-4 rounded font-bold">Run</button>
        </div>
    );
    
    const renderAbilityButtons = () => (
         <div className="grid grid-cols-2 gap-4">
            {playerMonster.abilities.map(ability => (
                <button key={ability.name} onClick={() => handleAbilityClick(ability)} className="bg-purple-600 hover:bg-purple-700 p-4 rounded font-bold text-sm">
                    {ability.name}
                    <span className="block text-xs opacity-75">{ability.type} / {ability.power} PWR</span>
                </button>
            ))}
             <button onClick={() => setShowActions(true)} className="bg-gray-500 hover:bg-gray-600 p-4 rounded font-bold col-span-2">Back</button>
        </div>
    );

    const renderSwitchMonsterScreen = () => (
        <div>
            <h3 className="text-center font-bold text-xl mb-2">Choose your next monster!</h3>
            <div className="grid grid-cols-2 gap-4">
                {playerMonsters.filter(m => m.currentHp > 0).map(monster => (
                    <button key={monster.instanceId} onClick={() => handleSwitchClick(monster.instanceId)} className="bg-green-600 hover:bg-green-700 p-4 rounded font-bold">
                        {monster.name}
                        <span className="block text-xs opacity-75">Lvl {monster.level}</span>
                    </button>
                ))}
            </div>
        </div>
    );


    return (
        <div>
            <BattleArena 
                playerMonster={playerMonster}
                opponentMonster={opponentMonster}
                playerEffects={effects.player}
                opponentEffects={effects.opponent}
                attackEffect={attackEffect}
            />

            <div className="mt-4 bg-gray-900 border-2 border-gray-600 rounded-lg p-4 h-28 flex flex-col justify-end">
                <div className="flex-grow overflow-y-auto">
                    {currentLog.map((entry, index) => (
                        <p key={index} className="text-lg animate-pulse-once">{entry}</p>
                    ))}
                </div>
            </div>

            <div className="mt-4">
                {turn === 'PLAYER' && !isPlayerMonsterFainted && (showActions ? renderActionButtons() : renderAbilityButtons())}
                {turn === 'PLAYER' && isPlayerMonsterFainted && renderSwitchMonsterScreen()}
                {turn === 'OPPONENT' && <div className="text-center p-4 font-bold text-xl animate-pulse">Opponent is thinking...</div>}
                {turn === 'ENDED' && <div className="text-center p-4 font-bold text-xl text-yellow-400">Battle Over!</div>}
            </div>
        </div>
    );
};

export default BattleScreen;