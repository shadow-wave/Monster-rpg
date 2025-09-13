
import { MonsterInstance, Ability, MonsterType } from './types';
import { TYPE_EFFECTIVENESS } from './constants';

export const calculateDamage = (attacker: MonsterInstance, defender: MonsterInstance, ability: Ability): { damage: number; effectiveness: number } => {
    let multiplier = 1;

    defender.type.forEach(defendingType => {
        if (TYPE_EFFECTIVENESS[ability.type].superEffective.includes(defendingType)) {
            multiplier *= 2;
        }
        if (TYPE_EFFECTIVENESS[ability.type].notVeryEffective.includes(defendingType)) {
            multiplier *= 0.5;
        }
        if (TYPE_EFFECTIVENESS[ability.type].immune.includes(defendingType)) {
            multiplier *= 0;
        }
    });

    const baseDamage = ability.power;
    const attackStat = attacker.stats.attack;
    const defenseStat = defender.stats.defense;

    // A simple damage formula
    const damage = Math.floor(
        (((2 * attacker.level) / 5 + 2) * baseDamage * (attackStat / defenseStat)) / 50 + 2
    ) * multiplier;
    
    // Add some randomness
    const finalDamage = Math.floor(damage * (Math.random() * 0.15 + 0.85));

    return { damage: Math.max(1, finalDamage), effectiveness: multiplier };
};

export const chooseOpponentAbility = (opponent: MonsterInstance, player: MonsterInstance): Ability => {
    const abilities = opponent.abilities;
    if (abilities.length <= 1) {
        return abilities[0];
    }

    const abilityScores = abilities.map(ability => {
        // Calculate potential damage and effectiveness to score the move
        const { damage, effectiveness } = calculateDamage(opponent, player, ability);

        // Priority 1: Check for a finishing blow
        if (player.currentHp <= damage) {
            // This is a kill shot, prioritize it heavily by giving it a massive score
            return { ability, score: 1000 + ability.power };
        }

        // Priority 2: Type effectiveness
        let score = 0;
        if (effectiveness > 1) {
            score = 100; // Super effective is highly valued
        } else if (effectiveness === 1) {
            score = 50; // Normal effectiveness is the baseline
        } else if (effectiveness > 0) {
            score = 10; // Not very effective is discouraged
        } else {
            score = 1; // Immune moves are almost never chosen, but not 0 to avoid issues if all moves are immune
        }

        // Factor in the ability's power, scaled down to not overshadow effectiveness too much
        score += ability.power / 5;
        
        // Add a small random factor to break ties and introduce slight unpredictability
        score += Math.random() * 5;

        return { ability, score };
    });

    // Sort abilities by their calculated score in descending order
    abilityScores.sort((a, b) => b.score - a.score);

    // AI Personality: Make it smart, but not perfectly predictable.
    // 70% chance to pick the best move.
    // 25% chance to pick the second best move (if available).
    // 5% chance to pick any other move.
    const randomChoice = Math.random();

    if (randomChoice < 0.70 || abilityScores.length === 1) {
        return abilityScores[0].ability;
    } 
    
    if (randomChoice < 0.95 && abilityScores.length > 1) {
        return abilityScores[1].ability;
    }

    // Fallback to a random choice amongst all abilities
    const randomIndex = Math.floor(Math.random() * abilities.length);
    return abilities[randomIndex];
};
