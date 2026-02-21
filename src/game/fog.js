export function initVisited(w, h) {
    const visited = [];
    for (let y = 0; y < h; y++) {
        visited[y] = [];
        for (let x = 0; x < w; x++) {
            visited[y][x] = false;
        }
    }
    return visited;
}

export function markVisited(visited, cell) {
    if (visited[cell.y] && visited[cell.y][cell.x] !== undefined) {
        visited[cell.y][cell.x] = true;
    }
}

export function isInLightRadius(playerCell, cell, radius) {
    const dx = cell.x - playerCell.x;
    const dy = cell.y - playerCell.y;
    const distSq = dx * dx + dy * dy;
    return distSq <= radius * radius;
}
