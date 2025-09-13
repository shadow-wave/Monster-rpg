import React from 'react';
import { MonsterInstance, MonsterType } from '../game/types';
import ProgressBar from './ProgressBar';

interface MonsterCardProps {
    monster: MonsterInstance;
    isPlayer?: boolean;
}

const typeColorMap: { [key in MonsterType]: string } = {
    [MonsterType.FIRE]: 'bg-red-500',
    [MonsterType.WATER]: 'bg-blue-500',
    [MonsterType.GRASS]: 'bg-green-600',
    [MonsterType.POISON]: 'bg-purple-600',
    [MonsterType.FLYING]: 'bg-indigo-400',
    [MonsterType.NORMAL]: 'bg-gray-500',
    [MonsterType.ELECTRIC]: 'bg-yellow-400 text-black',
};

const MonsterCard: React.FC<MonsterCardProps> = ({ monster, isPlayer = false }) => {
    const getHpColor = (hp: number, maxHp: number) => {
        const percentage = hp / maxHp;
        if (percentage > 0.5) return 'bg-green-500';
        if (percentage > 0.2) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className={`bg-gray-800 bg-opacity-80 p-2 rounded-md shadow-lg border ${isPlayer ? 'border-blue-500' : 'border-red-500'}`}>
            <div className="flex justify-between items-center mb-1">
                <h3 className="text-lg font-bold truncate">{monster.name}</h3>
                <span className="text-sm font-semibold ml-2">Lvl {monster.level}</span>
            </div>
             <ProgressBar
                current={monster.currentHp}
                max={monster.maxHp}
                color={getHpColor(monster.currentHp, monster.maxHp)}
            />
            {isPlayer && (
                 <div className="mt-1">
                     <ProgressBar
                        current={monster.currentXp}
                        max={monster.xpToNextLevel}
                        color="bg-cyan-500"
                    />
                 </div>
            )}
        </div>
    );
};

export default MonsterCard;