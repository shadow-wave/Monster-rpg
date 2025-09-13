
import React, { useState } from 'react';
import { GameState, GameAction, MonsterInstance } from '../game/types';
import ProgressBar from './ProgressBar';

interface MainMenuProps {
    gameState: GameState;
    dispatch: React.Dispatch<GameAction>;
}

const PartySlot: React.FC<{ monster: MonsterInstance; isActive: boolean; isSelected: boolean; onClick: () => void }> = ({ monster, isActive, isSelected, onClick }) => {
    const ringClasses = isSelected
        ? 'ring-4 ring-blue-500'
        : isActive
        ? 'ring-4 ring-yellow-400'
        : 'ring-2 ring-gray-600 hover:ring-yellow-300';

    return (
        <div
            onClick={onClick}
            className={`bg-gray-700 p-3 rounded-lg flex items-center space-x-3 cursor-pointer transition-all duration-200 h-full min-h-[110px] ${ringClasses}`}
            style={{ userSelect: 'none' }}
        >
            <img src={monster.spriteUrls.front} alt={monster.name} className="w-14 h-14 bg-gray-800 p-1 rounded-full flex-shrink-0" />
            <div className="flex-grow">
                <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-md">{monster.name}</h4>
                    <span className="text-xs text-gray-400">Lvl {monster.level}</span>
                </div>
                <ProgressBar current={monster.currentHp} max={monster.maxHp} color={monster.currentHp > 0 ? 'bg-green-500' : 'bg-red-500'} />
                <div className="mt-1">
                    <ProgressBar current={monster.currentXp} max={monster.xpToNextLevel} color="bg-cyan-500" label="" />
                </div>
            </div>
        </div>
    );
};

const EmptyPartySlot: React.FC<{ onClick: () => void; isDropTarget: boolean }> = ({ onClick, isDropTarget }) => (
    <div
        onClick={onClick}
        className={`bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center h-full min-h-[110px] cursor-pointer transition-all ${
            isDropTarget ? 'border-solid border-blue-500 bg-blue-900/30' : 'hover:border-gray-500'
        }`}
    >
        <span className="text-gray-500 text-sm">Empty</span>
    </div>
);


const MainMenu: React.FC<MainMenuProps> = ({ gameState, dispatch }) => {
    const [saveMessage, setSaveMessage] = useState('');
    const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

    const handleSaveGame = () => {
        dispatch({ type: 'SAVE_GAME' });
        setSaveMessage('Game Saved Successfully!');
        setTimeout(() => {
            setSaveMessage('');
        }, 3000);
    };

    const handleNewGame = () => {
        if (window.confirm('Are you sure you want to start a new game? All saved progress will be lost.')) {
            dispatch({ type: 'NEW_GAME' });
        }
    };

    const handleSlotClick = (index: number) => {
        const partySlots: (MonsterInstance | null)[] = Array(6).fill(null);
        gameState.player.monsters.forEach((m, i) => { partySlots[i] = m; });

        if (selectedSlot === null) {
            if (partySlots[index]) {
                setSelectedSlot(index);
            }
        } else {
            if (selectedSlot === index) {
                setSelectedSlot(null);
                return;
            }
            
            [partySlots[selectedSlot], partySlots[index]] = [partySlots[index], partySlots[selectedSlot]];

            const newPartyOrder = partySlots.filter((m): m is MonsterInstance => m !== null);
            dispatch({ type: 'SET_PARTY_ORDER', payload: newPartyOrder });

            setSelectedSlot(null);
        }
    };
    
    const partySlotsForRender: (MonsterInstance | null)[] = Array(6).fill(null);
    gameState.player.monsters.forEach((monster, index) => {
        partySlotsForRender[index] = monster;
    });

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 text-center">Main Menu</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <button
                    onClick={() => dispatch({ type: 'START_BATTLE' })}
                    disabled={!gameState.player.monsters.some(m => m.currentHp > 0)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    Find a Wild Monster
                </button>
                <button
                    onClick={() => dispatch({ type: 'GO_TO_HEALING_CENTER' })}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-colors duration-300"
                >
                    Visit Healing Center
                </button>
                 <button
                    onClick={handleSaveGame}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-colors duration-300"
                >
                    Save Game
                </button>
                <button
                    onClick={handleNewGame}
                    className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-colors duration-300"
                >
                    New Game
                </button>
            </div>
            
            {saveMessage && (
                <p className="text-center text-green-400 mb-4 animate-pulse">{saveMessage}</p>
            )}

             <div className="text-center mb-4 grid grid-cols-3 gap-2">
                <p>Potions: <span className="font-bold text-yellow-400">{gameState.player.inventory.potions}</span></p>
                <p>Orbs: <span className="font-bold text-yellow-400">{gameState.player.inventory.monsterOrbs}</span></p>
                 <p>Win Streak: <span className="font-bold text-yellow-400">{gameState.player.winStreak}</span></p>
            </div>

            <div className="mt-6 border-t-2 border-gray-700 pt-4">
                <h3 className="text-xl font-semibold mb-2 text-center">Your Party</h3>
                <p className="text-center text-gray-400 text-sm mb-4 h-5">
                    {selectedSlot !== null 
                        ? 'Click another slot to move the monster.' 
                        : 'Click a monster to select and move it.'}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {partySlotsForRender.map((monster, index) =>
                        monster ? (
                            <PartySlot
                                key={monster.instanceId}
                                monster={monster}
                                isActive={index === 0}
                                isSelected={selectedSlot === index}
                                onClick={() => handleSlotClick(index)}
                            />
                        ) : (
                            <EmptyPartySlot
                                key={`empty-${index}`}
                                isDropTarget={selectedSlot !== null}
                                onClick={() => handleSlotClick(index)}
                            />
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default MainMenu;