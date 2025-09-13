export enum MonsterType {
    FIRE = 'FIRE',
    WATER = 'WATER',
    GRASS = 'GRASS',
    POISON = 'POISON',
    FLYING = 'FLYING',
    NORMAL = 'NORMAL',
    ELECTRIC = 'ELECTRIC',
}

export enum GameScreen {
    STARTER_SELECTION = 'STARTER_SELECTION',
    MAIN_MENU = 'MAIN_MENU',
    BATTLE = 'BATTLE',
    HEALING_CENTER = 'HEALING_CENTER',
}

export interface Ability {
    name: string;
    power: number;
    type: MonsterType;
    description: string;
}

export interface Monster {
    id: number;
    name: string;
    type: MonsterType[];
    baseStats: {
        hp: number;
        attack: number;
        defense: number;
    };
    abilities: Ability[];
    evolution?: {
        level: number;
        to: number; // id of the monster it evolves to
    };
    spriteUrls: {
        front: string;
        back: string;
    };
}

export interface MonsterInstance extends Monster {
    instanceId: string;
    level: number;
    currentHp: number;
    maxHp: number;
    currentXp: number;
    xpToNextLevel: number;
    stats: {
        attack: number;
        defense: number;
    };
}

export interface BattleState {
    playerMonster: MonsterInstance;
    opponentMonster: MonsterInstance;
    turn: 'PLAYER' | 'OPPONENT' | 'ENDED';
    log: string[];
    isCatching: boolean;
}

export interface PlayerState {
    monsters: MonsterInstance[];
    inventory: {
        potions: number;
        monsterOrbs: number;
    };
    winStreak: number;
}

export interface GameState {
    screen: GameScreen;
    player: PlayerState;
    battle: BattleState | null;
}

export type GameAction =
    | { type: 'CHOOSE_STARTER'; payload: number }
    | { type: 'START_BATTLE' }
    | { type: 'PLAYER_ATTACK'; payload: Ability }
    | { type: 'OPPONENT_ATTACK' }
    | { type: 'ATTEMPT_CATCH' }
    | { type: 'BATTLE_VICTORY' }
    | { type: 'BATTLE_DEFEAT' }
    | { type: 'USE_POTION' }
    | { type: 'GO_TO_HEALING_CENTER' }
    | { type: 'HEAL_ALL_MONSTERS' }
    | { type: 'RETURN_TO_MENU' }
    | { type: 'SAVE_GAME' }
    | { type: 'NEW_GAME' }
    | { type: 'SET_PARTY_ORDER'; payload: MonsterInstance[] }
    | { type: 'SWITCH_ACTIVE_MONSTER_IN_BATTLE'; payload: string }; // instanceId