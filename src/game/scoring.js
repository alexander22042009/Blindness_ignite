export function multiplierForLevel(level) {
    if (level === 0) return 1.0;
    return 1 + (level - 1) * 0.35;
}

export function pointsForKey(level) {
    return 100 * multiplierForLevel(level);
}

export function pointsForDoor(level) {
    return 300 * multiplierForLevel(level);
}

export function timeBonus(level, time, targetTime) {
    if (time > targetTime) return 0;
    return (targetTime - time) * 5 * multiplierForLevel(level);
}

export function streakBonus(level) {
    return 50 * multiplierForLevel(level);
}

export function pointsForGem(level) {
    return 67;
}

export function gemCompletionBonus(level, gemsCollected, gemsTotal) {
    if (gemsTotal === 0) return 0;
    return Math.round((gemsCollected / gemsTotal) * 200 * multiplierForLevel(level));
}

export function maxPossibleForLevel(level, targetTime, gemsTotal = 0) {
    const mult = multiplierForLevel(level);
    const keyPoints = 2 * 100 * mult;
    const doorPoints = 300 * mult;
    const timeBonusMax = targetTime * 5 * mult;
    const streakBonusMax = 1 * 50 * mult;
    const maxGems = gemsTotal * 67;
    const maxGemBonus = 200 * mult;
    return keyPoints + doorPoints + timeBonusMax + streakBonusMax + maxGems + maxGemBonus;
}
