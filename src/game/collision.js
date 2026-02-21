export function checkCollision(grid, x, y, cellSize) {
    const cellX = Math.floor(x / cellSize);
    const cellY = Math.floor(y / cellSize);
    
    if (cellY < 0 || cellY >= grid.length) return true;
    if (cellX < 0 || cellX >= grid[0].length) return true;
    
    return grid[cellY][cellX] === 0;
}

export function clampPosition(x, y, gridW, gridH, cellSize) {
    const maxX = gridW * cellSize;
    const maxY = gridH * cellSize;
    
    return {
        x: Math.max(0, Math.min(x, maxX - cellSize)),
        y: Math.max(0, Math.min(y, maxY - cellSize))
    };
}
