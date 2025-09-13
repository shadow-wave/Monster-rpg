
import { useReducer } from 'react';
import { GameState, GameAction, GameScreen, MonsterInstance, BattleState } from '../game/types';
import { MONSTERS, WILD_MONSTER_IDS, LEGENDARY_MONSTER_IDS } from '../game/monsters';
import { XP_PER_LEVEL } from '../game/constants';
import { calculateDamage, chooseOpponentAbility } from '../game/battleLogic';

const SAVE_KEY = 'monster-battler-rpg-save';

function createMonsterInstance(monsterId: number, level: number): MonsterInstance {
    const baseMonster = MONSTERS[monsterId];
    if (!baseMonster) throw new Error(`Monster with id ${monsterId} not found`);

    const instanceId = `${monsterId}-${Date.now()}-${Math.random()}`;

    const maxHp = Math.floor(baseMonster.baseStats.hp * (level / 20)) + baseMonster.baseStats.hp;
    const attack = Math.floor(baseMonster.baseStats.attack * (level / 20)) + baseMonster.baseStats.attack;
    const defense = Math.floor(baseMonster.baseStats.defense * (level / 20)) + baseMonster.baseStats.defense;

    return {
        ...baseMonster,
        instanceId,
        level,
        currentHp: maxHp,
        maxHp: maxHp,
        currentXp: 0,
        xpToNextLevel: XP_PER_LEVEL(level),
        stats: { attack, defense },
    };
}


const defaultInitialState: GameState = {
    screen: GameScreen.STARTER_SELECTION,
    player: {
        monsters: [],
        inventory: {
            potions: 5,
            monsterOrbs: 10,
        },
        winStreak: 0,
    },
    battle: null,
};

function getInitialState(): GameState {
    try {
        const savedStateJSON = localStorage.getItem(SAVE_KEY);
        if (savedStateJSON) {
            const savedState = JSON.parse(savedStateJSON);
            if (savedState && typeof savedState === 'object' && savedState.screen) {
                 // Ensure winStreak exists on loaded data
                if (!savedState.player.winStreak) {
                    savedState.player.winStreak = 0;
                }
                return savedState;
            }
        }
    } catch (error) {
        console.error("Could not load game state from local storage:", error);
        localStorage.removeItem(SAVE_KEY); 
    }
    return defaultInitialState;
}


function gameReducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {
        case 'CHOOSE_STARTER':
            return {
                ...state,
                screen: GameScreen.MAIN_MENU,
                player: {
                    ...state.player,
                    monsters: [createMonsterInstance(action.payload, 5)],
                },
            };
        
        case 'START_BATTLE': {
            const playerMonster = state.player.monsters.find(m => m.currentHp > 0);
            if (!playerMonster) return state; // No healthy monsters

            // Determine opponent level based on win streak
            const levelBonus = Math.floor(state.player.winStreak / 2);
            const opponentLevel = Math.max(1, playerMonster.level - 2 + Math.floor(Math.random() * 4) + levelBonus);

            let wildMonsterId;
            // After 10 wins, 20% chance for a legendary
            if (state.player.winStreak >= 10 && Math.random() < 0.2) {
                 wildMonsterId = LEGENDARY_MONSTER_IDS[Math.floor(Math.random() * LEGENDARY_MONSTER_IDS.length)];
            } else {
                 wildMonsterId = WILD_MONSTER_IDS[Math.floor(Math.random() * WILD_MONSTER_IDS.length)];
            }

            const opponentMonster = createMonsterInstance(wildMonsterId, opponentLevel);
            
            const battleState: BattleState = {
                playerMonster,
                opponentMonster,
                turn: 'PLAYER',
                log: [`A wild ${opponentMonster.name} appeared!`],
                isCatching: false,
            };

            return { ...state, screen: GameScreen.BATTLE, battle: battleState };
        }

        case 'PLAYER_ATTACK': {
            if (!state.battle || state.battle.turn !== 'PLAYER') return state;
            const { playerMonster, opponentMonster } = state.battle;
            
            const { damage, effectiveness } = calculateDamage(playerMonster, opponentMonster, action.payload);
            const newOpponentHp = Math.max(0, opponentMonster.currentHp - damage);

            let logMessage = `${playerMonster.name} used ${action.payload.name}! It dealt ${damage} damage.`;
            if (effectiveness > 1) logMessage += " It's super effective!";
            if (effectiveness < 1 && effectiveness > 0) logMessage += " It's not very effective...";
            if (effectiveness === 0) logMessage += " It had no effect!";

            const newLog = [...state.battle.log, logMessage];

            if (newOpponentHp <= 0) {
                 newLog.push(`The wild ${opponentMonster.name} fainted!`);
                 return {
                     ...state,
                     battle: {
                         ...state.battle,
                         opponentMonster: { ...opponentMonster, currentHp: 0 },
                         turn: 'ENDED',
                         log: newLog,
                     }
                 }
            }
            
            return {
                ...state,
                battle: {
                    ...state.battle,
                    opponentMonster: { ...opponentMonster, currentHp: newOpponentHp },
                    turn: 'OPPONENT',
                    log: newLog
                },
            };
        }

        case 'OPPONENT_ATTACK': {
            if (!state.battle || state.battle.turn !== 'OPPONENT') return state;
            const { playerMonster, opponentMonster } = state.battle;

            const opponentAbility = chooseOpponentAbility(opponentMonster, playerMonster);
            const { damage } = calculateDamage(opponentMonster, playerMonster, opponentAbility);
            let newPlayerHp = Math.max(0, playerMonster.currentHp - damage);

            const newLog = [...state.battle.log, `Wild ${opponentMonster.name} used ${opponentAbility.name}! It dealt ${damage} damage.`];
            
            const playerMonsterInParty = state.player.monsters.find(m => m.instanceId === playerMonster.instanceId)!;
            const updatedMonsterInParty = { ...playerMonsterInParty, currentHp: newPlayerHp };
            const updatedParty = state.player.monsters.map(m => m.instanceId === playerMonster.instanceId ? updatedMonsterInParty : m);

            if (newPlayerHp <= 0) {
                newLog.push(`Your ${playerMonster.name} fainted!`);
                const hasHealthyMonsters = updatedParty.some(m => m.currentHp > 0);
                if (!hasHealthyMonsters) {
                     newLog.push(`You have no more monsters to fight!`);
                     return {
                        ...state,
                        player: { ...state.player, monsters: updatedParty },
                        battle: { ...state.battle, turn: 'ENDED', log: newLog },
                    }
                } else {
                    // Player needs to switch, keep turn as PLAYER
                    return {
                        ...state,
                        player: { ...state.player, monsters: updatedParty },
                        battle: {
                            ...state.battle,
                            playerMonster: { ...playerMonster, currentHp: 0 },
                            turn: 'PLAYER',
                            log: newLog,
                        },
                    }
                }
            }

            return {
                ...state,
                player: { ...state.player, monsters: updatedParty },
                battle: {
                    ...state.battle,
                    playerMonster: { ...playerMonster, currentHp: newPlayerHp },
                    turn: 'PLAYER',
                    log: newLog,
                },
            };
        }
        
        case 'ATTEMPT_CATCH': {
            if (!state.battle || state.player.inventory.monsterOrbs <= 0) return state;

            const { opponentMonster } = state.battle;
            const catchRate = (1 - (opponentMonster.currentHp / opponentMonster.maxHp)) * 0.5 + 0.1; // Higher chance at low health
            const success = Math.random() < catchRate;

            let newLog = [...state.battle.log];
            let newPlayerState = { ...state.player, inventory: { ...state.player.inventory, monsterOrbs: state.player.inventory.monsterOrbs - 1 }};
            
            if (success) {
                newLog.push(`Gotcha! ${opponentMonster.name} was caught!`);
                if (newPlayerState.monsters.length < 6) {
                    newPlayerState.monsters.push(opponentMonster);
                } else {
                    newLog.push(`${opponentMonster.name} was sent to storage (feature not implemented).`);
                }
                return {
                    ...state,
                    player: newPlayerState,
                    battle: { ...state.battle, turn: 'ENDED', log: newLog }
                };
            } else {
                newLog.push(`Oh no! The monster broke free!`);
                return {
                    ...state,
                    player: newPlayerState,
                    battle: { ...state.battle, turn: 'OPPONENT', log: newLog }
                };
            }
        }
        
        case 'BATTLE_VICTORY': {
            if (!state.battle) return state;
            const xpGained = Math.floor(state.battle.opponentMonster.level * 15);
            let playerMonster = state.player.monsters.find(m => m.instanceId === state.battle?.playerMonster.instanceId);
            if (!playerMonster) return { ...state, battle: null, screen: GameScreen.MAIN_MENU };

            playerMonster.currentXp += xpGained;

            // Handle Level Up
            while (playerMonster.currentXp >= playerMonster.xpToNextLevel) {
                playerMonster.level++;
                playerMonster.currentXp -= playerMonster.xpToNextLevel;
                playerMonster.xpToNextLevel = XP_PER_LEVEL(playerMonster.level);
                // Update stats on level up
                const base = MONSTERS[playerMonster.id];
                playerMonster.maxHp = Math.floor(base.baseStats.hp * (playerMonster.level / 20)) + base.baseStats.hp;
                playerMonster.stats.attack = Math.floor(base.baseStats.attack * (playerMonster.level / 20)) + base.baseStats.attack;
                playerMonster.stats.defense = Math.floor(base.baseStats.defense * (playerMonster.level / 20)) + base.baseStats.defense;
                playerMonster.currentHp = playerMonster.maxHp; // Full heal on level up
            }

            // Handle Evolution
            if (playerMonster.evolution && playerMonster.level >= playerMonster.evolution.level) {
                const evolutionId = playerMonster.evolution.to;
                const newMonsterInstance = createMonsterInstance(evolutionId, playerMonster.level);
                newMonsterInstance.currentXp = playerMonster.currentXp;
                newMonsterInstance.instanceId = playerMonster.instanceId; // Keep same instance id
                playerMonster = newMonsterInstance;
            }

            const updatedMonsters = state.player.monsters.map(m => m.instanceId === playerMonster!.instanceId ? playerMonster! : m);

            return { 
                ...state, 
                battle: null, 
                screen: GameScreen.MAIN_MENU, 
                player: { ...state.player, monsters: updatedMonsters, winStreak: state.player.winStreak + 1 }
            };
        }
        
        case 'BATTLE_DEFEAT':
             return { ...state, battle: null, screen: GameScreen.MAIN_MENU, player: {...state.player, winStreak: 0 } };

        case 'USE_POTION': {
            if (!state.battle || state.player.inventory.potions <= 0) return state;
            
            const { playerMonster } = state.battle;
            const healAmount = Math.floor(playerMonster.maxHp * 0.5);
            const newHp = Math.min(playerMonster.maxHp, playerMonster.currentHp + healAmount);

            const updatedPlayerMonster = { ...playerMonster, currentHp: newHp };
            const updatedParty = state.player.monsters.map(m => m.instanceId === playerMonster.instanceId ? updatedPlayerMonster : m);
            
            return {
                ...state,
                player: {
                    ...state.player,
                    monsters: updatedParty,
                    inventory: {
                        ...state.player.inventory,
                        potions: state.player.inventory.potions - 1
                    }
                },
                battle: {
                    ...state.battle,
                    playerMonster: updatedPlayerMonster,
                    turn: 'OPPONENT',
                    log: [...state.battle.log, `You used a potion! Restored ${healAmount} HP.`]
                }
            };
        }
        
        case 'GO_TO_HEALING_CENTER':
            return { ...state, screen: GameScreen.HEALING_CENTER };

        case 'HEAL_ALL_MONSTERS': {
            const healedMonsters = state.player.monsters.map(m => ({
                ...m,
                currentHp: m.maxHp,
            }));
            return {
                ...state,
                player: { ...state.player, monsters: healedMonsters },
            };
        }

        case 'RETURN_TO_MENU':
            return { ...state, screen: GameScreen.MAIN_MENU };

        case 'SAVE_GAME': {
            try {
                localStorage.setItem(SAVE_KEY, JSON.stringify(state));
            } catch (error) {
                console.error("Failed to save game:", error);
            }
            return state;
        }

        case 'NEW_GAME': {
            localStorage.removeItem(SAVE_KEY);
            return defaultInitialState;
        }

        case 'SET_PARTY_ORDER': {
            return { ...state, player: { ...state.player, monsters: action.payload } };
        }

        case 'SWITCH_ACTIVE_MONSTER_IN_BATTLE': {
            if (!state.battle) return state;
            const newActiveMonster = state.player.monsters.find(m => m.instanceId === action.payload);
            if (!newActiveMonster || newActiveMonster.currentHp <= 0) return state;
            
            return {
                ...state,
                battle: {
                    ...state.battle,
                    playerMonster: newActiveMonster,
                    log: [...state.battle.log, `Go, ${newActiveMonster.name}!`],
                }
            }
        }

        default:
            return state;
    }
}

const useGameState = () => {
    const [gameState, dispatch] = useReducer(gameReducer, undefined, getInitialState);
    return { gameState, dispatch };
};

export default useGameState;