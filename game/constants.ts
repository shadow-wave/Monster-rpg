import { MonsterType } from './types';

type EffectivenessMap = {
    [key in MonsterType]: {
        superEffective: MonsterType[];
        notVeryEffective: MonsterType[];
        immune: MonsterType[];
    };
};

export const TYPE_EFFECTIVENESS: EffectivenessMap = {
    [MonsterType.FIRE]: {
        superEffective: [MonsterType.GRASS],
        notVeryEffective: [MonsterType.FIRE, MonsterType.WATER],
        immune: [],
    },
    [MonsterType.WATER]: {
        superEffective: [MonsterType.FIRE],
        notVeryEffective: [MonsterType.WATER, MonsterType.GRASS],
        immune: [],
    },
    [MonsterType.GRASS]: {
        superEffective: [MonsterType.WATER],
        notVeryEffective: [MonsterType.FIRE, MonsterType.GRASS, MonsterType.POISON, MonsterType.FLYING],
        immune: [],
    },
    [MonsterType.NORMAL]: {
        superEffective: [],
        notVeryEffective: [],
        immune: [],
    },
    [MonsterType.ELECTRIC]: {
        superEffective: [MonsterType.WATER, MonsterType.FLYING],
        notVeryEffective: [MonsterType.GRASS, MonsterType.ELECTRIC],
        immune: [],
    },
    [MonsterType.POISON]: {
        superEffective: [MonsterType.GRASS],
        notVeryEffective: [MonsterType.POISON],
        immune: [],
    },
    [MonsterType.FLYING]: {
        superEffective: [MonsterType.GRASS],
        notVeryEffective: [MonsterType.ELECTRIC],
        immune: [],
    },
};

export const XP_PER_LEVEL = (level: number): number => {
    return Math.floor(10 * Math.pow(level, 2));
};