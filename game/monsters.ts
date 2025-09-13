import { Monster, MonsterType } from './types';

const getSpriteUrls = (id: number, name: string): { front: string, back: string } => ({
    front: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    back: `https://play.pokemonshowdown.com/sprites/gen5ani-back/${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.gif`,
});


export const MONSTERS: Record<number, Monster> = {
    // Starters & Evolutions
    1: {
        id: 1,
        name: 'Bulbasaur',
        type: [MonsterType.GRASS, MonsterType.POISON],
        baseStats: { hp: 45, attack: 49, defense: 49 },
        abilities: [
            { name: 'Tackle', power: 40, type: MonsterType.NORMAL, description: 'A basic physical attack.' },
            { name: 'Vine Whip', power: 45, type: MonsterType.GRASS, description: 'Whips the foe with vines.' },
        ],
        evolution: { level: 16, to: 2 },
        spriteUrls: getSpriteUrls(1, 'Bulbasaur'),
    },
    2: {
        id: 2,
        name: 'Ivysaur',
        type: [MonsterType.GRASS, MonsterType.POISON],
        baseStats: { hp: 60, attack: 62, defense: 63 },
        abilities: [
            { name: 'Tackle', power: 40, type: MonsterType.NORMAL, description: 'A basic physical attack.' },
            { name: 'Vine Whip', power: 45, type: MonsterType.GRASS, description: 'Whips the foe with vines.' },
            { name: 'Poison Powder', power: 0, type: MonsterType.POISON, description: 'Poisons the foe.' }, // Note: Status effects not implemented, acts as weak attack
        ],
        evolution: { level: 32, to: 3 },
        spriteUrls: getSpriteUrls(2, 'Ivysaur'),
    },
    3: {
        id: 3,
        name: 'Venusaur',
        type: [MonsterType.GRASS, MonsterType.POISON],
        baseStats: { hp: 80, attack: 82, defense: 83 },
        abilities: [
            { name: 'Razor Leaf', power: 55, type: MonsterType.GRASS, description: 'A sharp-edged leaf.' },
            { name: 'Solar Beam', power: 120, type: MonsterType.GRASS, description: 'A powerful two-turn attack.' },
        ],
        spriteUrls: getSpriteUrls(3, 'Venusaur'),
    },
    4: {
        id: 4,
        name: 'Charmander',
        type: [MonsterType.FIRE],
        baseStats: { hp: 39, attack: 52, defense: 43 },
        abilities: [
            { name: 'Scratch', power: 40, type: MonsterType.NORMAL, description: 'A basic scratching attack.' },
            { name: 'Ember', power: 40, type: MonsterType.FIRE, description: 'A small burst of flame.' },
        ],
        evolution: { level: 16, to: 5 },
        spriteUrls: getSpriteUrls(4, 'Charmander'),
    },
    5: {
        id: 5,
        name: 'Charmeleon',
        type: [MonsterType.FIRE],
        baseStats: { hp: 58, attack: 64, defense: 58 },
        abilities: [
            { name: 'Scratch', power: 40, type: MonsterType.NORMAL, description: 'A basic scratching attack.' },
            { name: 'Flame Burst', power: 70, type: MonsterType.FIRE, description: 'A strong burst of flame.' },
        ],
        evolution: { level: 36, to: 6 },
        spriteUrls: getSpriteUrls(5, 'Charmeleon'),
    },
    6: {
        id: 6,
        name: 'Charizard',
        type: [MonsterType.FIRE, MonsterType.FLYING],
        baseStats: { hp: 78, attack: 84, defense: 78 },
        abilities: [
            { name: 'Flamethrower', power: 90, type: MonsterType.FIRE, description: 'Engulfs the foe in a firestorm.' },
            { name: 'Air Slash', power: 75, type: MonsterType.FLYING, description: 'A sharp blade of wind.' },
        ],
        spriteUrls: getSpriteUrls(6, 'Charizard'),
    },
    7: {
        id: 7,
        name: 'Squirtle',
        type: [MonsterType.WATER],
        baseStats: { hp: 44, attack: 48, defense: 65 },
        abilities: [
            { name: 'Tackle', power: 40, type: MonsterType.NORMAL, description: 'A basic physical attack.' },
            { name: 'Water Gun', power: 40, type: MonsterType.WATER, description: 'Shoots a jet of water.' },
        ],
        evolution: { level: 16, to: 8 },
        spriteUrls: getSpriteUrls(7, 'Squirtle'),
    },
    8: {
        id: 8,
        name: 'Wartortle',
        type: [MonsterType.WATER],
        baseStats: { hp: 59, attack: 63, defense: 80 },
        abilities: [
            { name: 'Water Gun', power: 40, type: MonsterType.WATER, description: 'Shoots a jet of water.' },
            { name: 'Bite', power: 60, type: MonsterType.NORMAL, description: 'A vicious bite.' },
        ],
        evolution: { level: 36, to: 9 },
        spriteUrls: getSpriteUrls(8, 'Wartortle'),
    },
    9: {
        id: 9,
        name: 'Blastoise',
        type: [MonsterType.WATER],
        baseStats: { hp: 79, attack: 83, defense: 100 },
        abilities: [
            { name: 'Hydro Pump', power: 110, type: MonsterType.WATER, description: 'A powerful blast of water.' },
            { name: 'Skull Bash', power: 130, type: MonsterType.NORMAL, description: 'A powerful headbutt.' },
        ],
        spriteUrls: getSpriteUrls(9, 'Blastoise'),
    },

    // Wild Monsters
    16: {
        id: 16,
        name: 'Pidgey',
        type: [MonsterType.NORMAL, MonsterType.FLYING],
        baseStats: { hp: 40, attack: 45, defense: 40 },
        abilities: [
            { name: 'Tackle', power: 40, type: MonsterType.NORMAL, description: 'A basic physical attack.' },
            { name: 'Gust', power: 40, type: MonsterType.FLYING, description: 'A light gust of wind.' },
        ],
        spriteUrls: getSpriteUrls(16, 'Pidgey'),
    },
    19: {
        id: 19,
        name: 'Rattata',
        type: [MonsterType.NORMAL],
        baseStats: { hp: 30, attack: 56, defense: 35 },
        abilities: [
            { name: 'Tackle', power: 40, type: MonsterType.NORMAL, description: 'A basic physical attack.' },
            { name: 'Quick Attack', power: 40, type: MonsterType.NORMAL, description: 'A speedy attack.' },
        ],
        spriteUrls: getSpriteUrls(19, 'Rattata'),
    },
    25: {
        id: 25,
        name: 'Pikachu',
        type: [MonsterType.ELECTRIC],
        baseStats: { hp: 35, attack: 55, defense: 40 },
        abilities: [
            { name: 'Quick Attack', power: 40, type: MonsterType.NORMAL, description: 'A speedy attack.' },
            { name: 'Thunder Shock', power: 40, type: MonsterType.ELECTRIC, description: 'An electric shock.' },
        ],
        spriteUrls: getSpriteUrls(25, 'Pikachu'),
    },
    41: {
        id: 41,
        name: 'Zubat',
        type: [MonsterType.POISON, MonsterType.FLYING],
        baseStats: { hp: 40, attack: 45, defense: 35 },
        abilities: [
            { name: 'Gust', power: 40, type: MonsterType.FLYING, description: 'A light gust of wind.' },
            { name: 'Poison Sting', power: 15, type: MonsterType.POISON, description: 'A weak poisonous sting.' },
        ],
        spriteUrls: getSpriteUrls(41, 'Zubat'),
    },
    43: {
        id: 43,
        name: 'Oddish',
        type: [MonsterType.GRASS, MonsterType.POISON],
        baseStats: { hp: 45, attack: 50, defense: 55 },
        abilities: [
            { name: 'Absorb', power: 20, type: MonsterType.GRASS, description: 'Drains HP from the foe.' },
            { name: 'Poison Powder', power: 0, type: MonsterType.POISON, description: 'Poisons the foe.' },
        ],
        spriteUrls: getSpriteUrls(43, 'Oddish'),
    },
    81: {
        id: 81,
        name: 'Magnemite',
        type: [MonsterType.ELECTRIC],
        baseStats: { hp: 25, attack: 35, defense: 70 },
        abilities: [
            { name: 'Thunder Shock', power: 40, type: MonsterType.ELECTRIC, description: 'An electric shock.' },
            { name: 'Tackle', power: 40, type: MonsterType.NORMAL, description: 'A basic physical attack.' },
        ],
        spriteUrls: getSpriteUrls(81, 'Magnemite'),
    },

    // Legendary Monsters
    144: {
        id: 144,
        name: 'Articuno',
        type: [MonsterType.FLYING], // Simplified
        baseStats: { hp: 90, attack: 85, defense: 100 },
        abilities: [
            { name: 'Ice Beam', power: 90, type: MonsterType.WATER, description: 'A chilling blast of ice.' },
            { name: 'Blizzard', power: 110, type: MonsterType.WATER, description: 'A harsh blizzard.' },
        ],
        spriteUrls: getSpriteUrls(144, 'Articuno'),
    },
    145: {
        id: 145,
        name: 'Zapdos',
        type: [MonsterType.ELECTRIC, MonsterType.FLYING],
        baseStats: { hp: 90, attack: 90, defense: 85 },
        abilities: [
            { name: 'Thunder Shock', power: 40, type: MonsterType.ELECTRIC, description: 'An electric shock.' },
            { name: 'Thunder', power: 110, type: MonsterType.ELECTRIC, description: 'A massive lightning bolt.' },
        ],
        spriteUrls: getSpriteUrls(145, 'Zapdos'),
    },
    146: {
        id: 146,
        name: 'Moltres',
        type: [MonsterType.FIRE, MonsterType.FLYING],
        baseStats: { hp: 90, attack: 100, defense: 90 },
        abilities: [
            { name: 'Ember', power: 40, type: MonsterType.FIRE, description: 'A small burst of flame.' },
            { name: 'Fire Blast', power: 110, type: MonsterType.FIRE, description: 'An intense blast of fire.' },
        ],
        spriteUrls: getSpriteUrls(146, 'Moltres'),
    },
    150: {
        id: 150,
        name: 'Mewtwo',
        type: [MonsterType.NORMAL], // Simplified
        baseStats: { hp: 106, attack: 110, defense: 90 },
        abilities: [
            { name: 'Psybeam', power: 65, type: MonsterType.NORMAL, description: 'A peculiar psychic beam.' },
            { name: 'Psychic', power: 90, type: MonsterType.NORMAL, description: 'A powerful psychic attack.' },
        ],
        spriteUrls: getSpriteUrls(150, 'Mewtwo'),
    }
};

export const WILD_MONSTER_IDS = [16, 19, 25, 41, 43, 81];
export const STARTER_MONSTER_IDS = [4, 7, 1]; // Charmander, Squirtle, Bulbasaur
export const LEGENDARY_MONSTER_IDS = [144, 145, 146, 150];