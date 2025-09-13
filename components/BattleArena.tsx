import React from 'react';
import { MonsterInstance, MonsterType } from '../game/types';
import MonsterCard from './MonsterCard';

interface BattleArenaProps {
    playerMonster: MonsterInstance;
    opponentMonster: MonsterInstance;
    playerEffects: string;
    opponentEffects: string;
    attackEffect: {
        origin: 'player' | 'opponent' | null;
        type: MonsterType | null;
    };
}

const BattleArena: React.FC<BattleArenaProps> = ({
    playerMonster,
    opponentMonster,
    playerEffects,
    opponentEffects,
    attackEffect,
}) => {
     const getProjectileClasses = () => {
        if (!attackEffect.origin || !attackEffect.type) return 'hidden';

        const baseClass = 'projectile';
        const typeClass = attackEffect.type.toLowerCase();
        const animationClass = attackEffect.origin === 'player' 
            ? 'animate-player-projectile' 
            : 'animate-opponent-projectile';
        
        return `${baseClass} ${typeClass} ${animationClass}`;
    };


    return (
        <div className="h-96 battle-arena">
            {/* Opponent's Side */}
            <div className="absolute top-2 right-2 w-1/3 max-w-[200px] z-20">
                <MonsterCard monster={opponentMonster} />
            </div>
            <div className="battle-platform platform-opponent"></div>
            <div className="absolute top-[30%] left-[55%] transform -translate-x-1/2 -translate-y-1/2 z-10">
                <img 
                    src={opponentMonster.spriteUrls.front} 
                    alt={opponentMonster.name} 
                    className={`w-32 h-32 object-contain filter drop-shadow-lg transition-transform duration-300 ${opponentEffects} ${opponentMonster.currentHp > 0 ? 'animate-float-idle' : ''}`}
                />
            </div>

            {/* Player's Side */}
            <div className="absolute bottom-24 left-2 w-1/3 max-w-[200px] z-20">
                <MonsterCard monster={playerMonster} isPlayer />
            </div>
            <div className="battle-platform platform-player"></div>
            <div className="absolute bottom-0 left-[45%] transform -translate-x-1/2 z-10">
                 <img 
                    src={playerMonster.spriteUrls.back} 
                    alt={playerMonster.name} 
                    className={`w-48 h-48 object-contain filter drop-shadow-lg transition-transform duration-300 ${playerEffects}`}
                />
            </div>
            
            {/* Projectile Element */}
            <div className={getProjectileClasses()}></div>
        </div>
    );
};

export default BattleArena;