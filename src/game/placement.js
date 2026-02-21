import { RNG } from '../core/rng.js';

export function listPassages(grid) {
    const passages = [];
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === 1) {
                passages.push({ x, y });
            }
        }
    }
    return passages;
}

export function bfsDistances(grid, start) {
    const h = grid.length;
    const w = grid[0].length;
    const dist = [];
    const queue = [{ x: start.x, y: start.y, d: 0 }];
    
    for (let y = 0; y < h; y++) {
        dist[y] = [];
        for (let x = 0; x < w; x++) {
            dist[y][x] = -1;
        }
    }
    
    dist[start.y][start.x] = 0;
    
    const dirs = [
        { dx: 0, dy: -1 },
        { dx: 1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: -1, dy: 0 }
    ];
    
    while (queue.length > 0) {
        const current = queue.shift();
        
        for (const dir of dirs) {
            const nx = current.x + dir.dx;
            const ny = current.y + dir.dy;
            
            if (nx >= 0 && nx < w && ny >= 0 && ny < h &&
                grid[ny][nx] === 1 && dist[ny][nx] === -1) {
                dist[ny][nx] = current.d + 1;
                queue.push({ x: nx, y: ny, d: current.d + 1 });
            }
        }
    }
    
    return dist;
}

export function placeKeys(grid, start, door, count = 3, rng = null) {
    if (!rng) rng = new RNG();
    
    const passages = listPassages(grid);
    const available = passages.filter(p => 
        !(p.x === start.x && p.y === start.y) &&
        !(p.x === door.x && p.y === door.y)
    );
    
    if (available.length < count) {
        return [];
    }
    
    const shuffled = rng.shuffle(available);
    const keys = [];
    
    for (let i = 0; i < count && i < shuffled.length; i++) {
        keys.push({
            x: shuffled[i].x,
            y: shuffled[i].y,
            collected: false
        });
    }
    
    return keys;
}

export function placeDoorFarthestByBFS(grid, start) {
    const dist = bfsDistances(grid, start);
    let maxDist = -1;
    let doorPos = null;
    
    for (let y = 0; y < dist.length; y++) {
        for (let x = 0; x < dist[y].length; x++) {
            if (dist[y][x] > maxDist && grid[y][x] === 1) {
                maxDist = dist[y][x];
                doorPos = { x, y };
            }
        }
    }
    
    return doorPos || { x: start.x, y: start.y };
}

export function placeGems(grid, start, keys, door, gemCount, rng = null) {
    if (!rng) rng = new RNG();
    
    const passages = listPassages(grid);
    
    const forbidden = new Set();
    forbidden.add(`${start.x},${start.y}`);
    forbidden.add(`${door.x},${door.y}`);
    
    for (const key of keys) {
        forbidden.add(`${key.x},${key.y}`);
    }
    
    const candidates = passages.filter(p => {
        const key = `${p.x},${p.y}`;
        if (forbidden.has(key)) return false;
        
        for (const fkey of forbidden) {
            const [fx, fy] = fkey.split(',').map(Number);
            const dx = Math.abs(p.x - fx);
            const dy = Math.abs(p.y - fy);
            if (dx <= 1 && dy <= 1) return false;
        }
        
        return true;
    });
    
    if (candidates.length === 0) return [];
    
    const shuffled = rng.shuffle(candidates);
    const gems = [];
    let minDistance = 3;
    
    while (gems.length < gemCount && minDistance >= 1) {
        gems.length = 0;
        
        for (const candidate of shuffled) {
            if (gems.length >= gemCount) break;
            
            let valid = true;
            for (const gem of gems) {
                const manhattan = Math.abs(candidate.x - gem.x) + Math.abs(candidate.y - gem.y);
                if (manhattan < minDistance) {
                    valid = false;
                    break;
                }
            }
            
            if (valid) {
                gems.push({
                    x: candidate.x,
                    y: candidate.y,
                    collected: false
                });
            }
        }
        
        if (gems.length < gemCount && minDistance > 1) {
            minDistance--;
        } else {
            break;
        }
    }
    
    return gems;
}
