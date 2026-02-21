import { RNG } from '../core/rng.js';

export function ensureOddDimensions(w, h) {
    if (w % 2 === 0) w -= 1;
    if (h % 2 === 0) h -= 1;
    return { w, h };
}

export function generateMazeDFS(w, h, start, rng = null) {
    if (!rng) rng = new RNG();
    
    const { w: oddW, h: oddH } = ensureOddDimensions(w, h);
    
    const grid = [];
    for (let y = 0; y < oddH; y++) {
        grid[y] = [];
        for (let x = 0; x < oddW; x++) {
            grid[y][x] = 0;
        }
    }
    
    const stack = [];
    const directions = [
        { dx: 0, dy: -2 },
        { dx: 2, dy: 0 },
        { dx: 0, dy: 2 },
        { dx: -2, dy: 0 }
    ];
    
    let sx = start.x;
    let sy = start.y;
    
    if (sx % 2 === 0) sx = Math.max(1, sx - 1);
    if (sy % 2 === 0) sy = Math.max(1, sy - 1);
    if (sx >= oddW) sx = oddW - 2;
    if (sy >= oddH) sy = oddH - 2;
    
    grid[sy][sx] = 1;
    stack.push({ x: sx, y: sy });
    
    while (stack.length > 0) {
        const current = stack[stack.length - 1];
        const neighbors = [];
        
        for (const dir of directions) {
            const nx = current.x + dir.dx;
            const ny = current.y + dir.dy;
            
            if (nx >= 1 && nx < oddW - 1 && ny >= 1 && ny < oddH - 1 && grid[ny][nx] === 0) {
                neighbors.push({ x: nx, y: ny, dir });
            }
        }
        
        if (neighbors.length > 0) {
            const next = rng.choice(neighbors);
            const midX = current.x + next.dir.dx / 2;
            const midY = current.y + next.dir.dy / 2;
            
            grid[midY][midX] = 1;
            grid[next.y][next.x] = 1;
            stack.push({ x: next.x, y: next.y });
        } else {
            stack.pop();
        }
    }
    
    return { grid, w: oddW, h: oddH, start: { x: sx, y: sy } };
}
