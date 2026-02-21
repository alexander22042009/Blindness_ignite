import { CONSTANTS } from './constants.js';

export class Player {
    constructor(x, y, cellSize) {
        this.x = x;
        this.y = y;
        this.cellSize = cellSize;
        this.radius = cellSize * CONSTANTS.PLAYER_RADIUS_FACTOR;
        this.cellX = Math.floor(x / cellSize);
        this.cellY = Math.floor(y / cellSize);
        this.lastCellX = this.cellX;
        this.lastCellY = this.cellY;
        this.animFrame = 0;
        this.animTimer = 0;
        this.input = null;
        this.facingRight = true;
    }
    
    update(dt, speed, grid, worldWidth, worldHeight) {
        const movement = this.input?.getMovement() || { dx: 0, dy: 0 };
        
        let dx = movement.dx;
        let dy = movement.dy;
        
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len > 0.001) {
            dx /= len;
            dy /= len;
        }
        
        dx *= speed * dt;
        dy *= speed * dt;
        
        const hasMovement = Math.abs(movement.dx) + Math.abs(movement.dy) > 0.001;
        
        if (hasMovement) {
            if (movement.dx < -0.001) {
                this.facingRight = false;
            } else if (movement.dx > 0.001) {
                this.facingRight = true;
            }
            
            this.animTimer += dt;
            if (this.animTimer >= CONSTANTS.WALK_ANIMATION_INTERVAL) {
                this.animTimer = 0;
                this.animFrame = 1 - this.animFrame;
            }
        } else {
            this.animFrame = 0;
            this.animTimer = 0;
        }
        
        let newX = this.x + dx;
        let newY = this.y + dy;
        
        newX = this.clampX(newX, grid, worldWidth);
        newY = this.clampY(newY, grid, worldHeight);
        
        if (dx !== 0) {
            if (this.wouldCollide(newX, this.y, grid)) {
                newX = this.x;
            }
        }
        
        if (dy !== 0) {
            if (this.wouldCollide(newX, newY, grid)) {
                newY = this.y;
            }
        }
        
        this.x = newX;
        this.y = newY;
        
        this.cellX = Math.floor(this.x / this.cellSize);
        this.cellY = Math.floor(this.y / this.cellSize);
    }
    
    wouldCollide(x, y, grid) {
        const r = this.radius;
        const corners = [
            { x: x - r, y: y - r },
            { x: x + r, y: y - r },
            { x: x - r, y: y + r },
            { x: x + r, y: y + r }
        ];
        
        for (const corner of corners) {
            const tileX = Math.floor(corner.x / this.cellSize);
            const tileY = Math.floor(corner.y / this.cellSize);
            
            if (tileY < 0 || tileY >= grid.length) return true;
            if (tileX < 0 || tileX >= grid[0].length) return true;
            
            if (grid[tileY][tileX] === 0) return true;
        }
        
        return false;
    }
    
    clampX(x, grid, worldWidth) {
        const r = this.radius;
        const epsilon = CONSTANTS.COLLISION_EPSILON;
        return Math.max(r + epsilon, Math.min(x, worldWidth - r - epsilon));
    }
    
    clampY(y, grid, worldHeight) {
        const r = this.radius;
        const epsilon = CONSTANTS.COLLISION_EPSILON;
        return Math.max(r + epsilon, Math.min(y, worldHeight - r - epsilon));
    }
    
    enteredNewCell() {
        if (this.cellX !== this.lastCellX || this.cellY !== this.lastCellY) {
            this.lastCellX = this.cellX;
            this.lastCellY = this.cellY;
            return true;
        }
        return false;
    }
}
