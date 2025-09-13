
import React, { useState, useEffect } from 'react';
import { GameAction } from '../game/types';

interface HealingCenterProps {
    dispatch: React.Dispatch<GameAction>;
}

const HealingCenter: React.FC<HealingCenterProps> = ({ dispatch }) => {
    const [isHealing, setIsHealing] = useState(false);

    useEffect(() => {
        if (isHealing) {
            const timer = setTimeout(() => {
                dispatch({ type: 'HEAL_ALL_MONSTERS' });
                dispatch({ type: 'RETURN_TO_MENU' });
            }, 2000);
            return () => clearTimeout(timer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isHealing, dispatch]);

    const handleHeal = () => {
        setIsHealing(true);
    };

    return (
        <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Healing Center</h2>
            {isHealing ? (
                <div>
                    <p className="text-lg animate-pulse text-green-400">Healing your monsters...</p>
                    <div className="mt-4 w-16 h-16 border-4 border-dashed rounded-full animate-spin border-green-500 mx-auto"></div>
                </div>
            ) : (
                <div>
                    <p className="mb-6">Welcome! We'll restore your monsters to full health.</p>
                    <div className="space-x-4">
                        <button
                            onClick={handleHeal}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors duration-300"
                        >
                            Heal Party
                        </button>
                         <button
                            onClick={() => dispatch({ type: 'RETURN_TO_MENU' })}
                            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors duration-300"
                        >
                            Back to Menu
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HealingCenter;
   