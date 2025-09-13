
import React, { useEffect } from 'react';
import useGameState from './hooks/useGameState';
import StarterSelection from './components/StarterSelection';
import MainMenu from './components/MainMenu';
import BattleScreen from './components/BattleScreen';
import HealingCenter from './components/HealingCenter';
import { GameScreen } from './game/types';
import { audioManager, MusicTrack } from './game/audioManager';

const App: React.FC = () => {
    const { gameState, dispatch } = useGameState();

    useEffect(() => {
        // This effect manages the background music based on the current game screen.
        switch (gameState.screen) {
            case GameScreen.BATTLE:
                audioManager.playMusic(MusicTrack.BATTLE);
                break;
            case GameScreen.MAIN_MENU:
            case GameScreen.HEALING_CENTER:
            case GameScreen.STARTER_SELECTION:
                audioManager.playMusic(MusicTrack.MAIN_MENU);
                break;
            default:
                // No music for other states or could implement a stop function
                break;
        }
    }, [gameState.screen]);

    const renderScreen = () => {
        switch (gameState.screen) {
            case GameScreen.STARTER_SELECTION:
                return <StarterSelection dispatch={dispatch} />;
            case GameScreen.MAIN_MENU:
                return <MainMenu gameState={gameState} dispatch={dispatch} />;
            case GameScreen.BATTLE:
                if (gameState.battle) {
                    return <BattleScreen battleState={gameState.battle} playerMonsters={gameState.player.monsters} dispatch={dispatch} />;
                }
                return null;
            case GameScreen.HEALING_CENTER:
                return <HealingCenter dispatch={dispatch} />;
            default:
                return <div>Loading...</div>;
        }
    };

    return (
        <div className="container mx-auto p-4 font-mono antialiased">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold text-yellow-400 tracking-wider">Monster Battler RPG</h1>
            </header>
            <main className="bg-gray-800 border-4 border-gray-700 rounded-lg p-6 shadow-2xl">
                {renderScreen()}
            </main>
            <footer className="text-center mt-6 text-gray-500 text-sm">
                <p>Created for an epic offline adventure. All game data is stored in your browser session.</p>
            </footer>
        </div>
    );
};

export default App;