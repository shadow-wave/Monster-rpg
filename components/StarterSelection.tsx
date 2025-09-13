import React from 'react';
import { GameAction } from '../game/types';
import { MONSTERS, STARTER_MONSTER_IDS } from '../game/monsters';

interface StarterSelectionProps {
    dispatch: React.Dispatch<GameAction>;
}

const StarterSelection: React.FC<StarterSelectionProps> = ({ dispatch }) => {
    const starters = STARTER_MONSTER_IDS.map(id => MONSTERS[id]);

    const handleSelect = (id: number) => {
        dispatch({ type: 'CHOOSE_STARTER', payload: id });
    };

    return (
        <div className="text-center">
            <h2 className="text-2xl font-bold mb-6 text-yellow-300">Choose Your First Pokémon!</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {starters.map(monster => (
                    <div
                        key={monster.id}
                        className="bg-gray-700 p-6 rounded-lg shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-300 border-2 border-transparent hover:border-yellow-400"
                        onClick={() => handleSelect(monster.id)}
                    >
                        <img src={monster.spriteUrls.front} alt={monster.name} className="mx-auto mb-4 h-32 w-32 object-contain" />
                        <h3 className="text-xl font-bold mb-2">{monster.name}</h3>
                        <div className="flex justify-center space-x-2">
                            {monster.type.map(t => (
                                <span key={t} className="px-2 py-1 text-xs font-semibold bg-gray-600 rounded-full">{t}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StarterSelection;