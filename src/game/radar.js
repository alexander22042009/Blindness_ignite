import { CONSTANTS } from './constants.js';
import { RNG } from '../core/rng.js';

let rng = new RNG();
let currentTarget = null;
let currentDist = Infinity;

export function chooseTarget(state) {
    const player = state.player;
    const keys = state.keys;
    const door = state.door;
    const keysCollected = state.keysCollected;
    
    let candidates = [];
    
    if (keysCollected < 2) {
        const uncollected = keys.filter(k => !k.collected);
        for (const key of uncollected) {
            const dx = key.x - player.cellX;
            const dy = key.y - player.cellY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            candidates.push({ type: 'key', obj: key, dist });
        }
    } else {
        const dx = door.x - player.cellX;
        const dy = door.y - player.cellY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        candidates.push({ type: 'door', obj: door, dist });
    }
    
    if (candidates.length === 0) {
        currentTarget = null;
        currentDist = Infinity;
        return null;
    }
    
    candidates.sort((a, b) => a.dist - b.dist);
    const closest = candidates[0];
    
    if (currentTarget === null) {
        currentTarget = closest;
        currentDist = closest.dist;
        return closest;
    }
    
    const threshold = CONSTANTS.STABILITY_THRESHOLD;
    
    if (closest.dist <= currentDist - threshold) {
        currentTarget = closest;
        currentDist = closest.dist;
        return closest;
    }
    
    const sameDist = candidates.filter(c => Math.abs(c.dist - currentDist) < 0.1);
    if (sameDist.length > 0 && currentTarget.dist === currentDist) {
        const sameType = sameDist.find(c => 
            c.type === currentTarget.type &&
            ((c.type === 'key' && c.obj.x === currentTarget.obj.x && c.obj.y === currentTarget.obj.y) ||
             (c.type === 'door'))
        );
        if (sameType) {
            return currentTarget;
        }
    }
    
    if (closest.dist < currentDist + threshold) {
        return currentTarget;
    }
    
    currentTarget = closest;
    currentDist = closest.dist;
    return currentTarget;
}

export function computeCompassAngle(playerPos, targetPos) {
    const dx = targetPos.x - playerPos.x;
    const dy = targetPos.y - playerPos.y;
    return Math.atan2(dy, dx);
}

export function resetRadar() {
    currentTarget = null;
    currentDist = Infinity;
}
