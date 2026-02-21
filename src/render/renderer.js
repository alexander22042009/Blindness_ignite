import { Sprites } from './sprites.js';
import { HUDRenderer } from './hudRenderer.js';
import { RadarRenderer } from './radarRenderer.js';
import { EffectsRenderer } from './effectsRenderer.js';
import { isInLightRadius } from '../game/fog.js';
import { CONSTANTS } from '../game/constants.js';

export class Renderer {
    static render(state, ctx, dt) {
        const cellSize = state.cellSize;
        const w = state.w;
        const h = state.h;
        const viewW = ctx.canvas.width;
        const viewH = ctx.canvas.height;
        
        const startTileX = Math.max(0, Math.floor(state.cameraX / cellSize));
        const endTileX = Math.min(w - 1, Math.ceil((state.cameraX + viewW) / cellSize));
        const startTileY = Math.max(0, Math.floor(state.cameraY / cellSize));
        const endTileY = Math.min(h - 1, Math.ceil((state.cameraY + viewH) / cellSize));
        
        ctx.save();
        ctx.translate(-state.cameraX, -state.cameraY);
        
        for (let y = startTileY; y <= endTileY; y++) {
            for (let x = startTileX; x <= endTileX; x++) {
                const worldX = x * cellSize;
                const worldY = y * cellSize;
                
                const tile = state.grid[y][x] === 1 ? 'path' : 'wall';
                const sprite = Sprites.get(tile);
                if (sprite) {
                    ctx.drawImage(sprite, worldX, worldY, cellSize, cellSize);
                }
            }
        }
        
        for (const key of state.keys) {
            if (!key.collected) {
                const worldX = key.x * cellSize;
                const worldY = key.y * cellSize;
                const screenX = worldX - state.cameraX;
                const screenY = worldY - state.cameraY;
                
                if (screenX >= -cellSize && screenX <= viewW + cellSize &&
                    screenY >= -cellSize && screenY <= viewH + cellSize) {
                    const sprite = Sprites.get('key');
                    if (sprite) {
                        const keySize = cellSize / 3;
                        const offsetX = (cellSize - keySize) / 2;
                        const offsetY = (cellSize - keySize) / 2;
                        ctx.drawImage(sprite, worldX + offsetX, worldY + offsetY, keySize, keySize);
                    }
                }
            }
        }
        
        for (const gem of state.gems) {
            if (!gem.collected) {
                const worldX = gem.x * cellSize;
                const worldY = gem.y * cellSize;
                const screenX = worldX - state.cameraX;
                const screenY = worldY - state.cameraY;
                
                if (screenX >= -cellSize && screenX <= viewW + cellSize &&
                    screenY >= -cellSize && screenY <= viewH + cellSize) {
                    const sprite = Sprites.get('gem');
                    if (sprite) {
                        const gemSize = cellSize / 2;
                        const offsetX = (cellSize - gemSize) / 2;
                        const offsetY = (cellSize - gemSize) / 2;
                        ctx.drawImage(sprite, worldX + offsetX, worldY + offsetY, gemSize, gemSize);
                    }
                }
            }
        }
        
        if (state.door) {
            const worldX = state.door.x * cellSize;
            const worldY = state.door.y * cellSize;
            const screenX = worldX - state.cameraX;
            const screenY = worldY - state.cameraY;
            
            if (screenX >= -cellSize && screenX <= viewW + cellSize &&
                screenY >= -cellSize && screenY <= viewH + cellSize) {
                let doorSprite = null;
                
                if (state.doorTransition.isPlaying) {
                    doorSprite = Sprites.get('door-opening_halfSec');
                } else if (state.doorUnlocked) {
                    doorSprite = Sprites.get('door_opened');
                } else {
                    doorSprite = Sprites.get('door_closed');
                }
                
                if (doorSprite) {
                    ctx.drawImage(doorSprite, worldX, worldY, cellSize, cellSize);
                }
            }
        }
        
        const playerSpriteName = state.player.animFrame === 0 ? 'hero1' : 'hero2';
        const playerSprite = Sprites.get(playerSpriteName);
        if (playerSprite) {
            const size = cellSize * CONSTANTS.PLAYER_SIZE;
            const x = state.player.x - size / 2;
            const y = state.player.y - size / 2;
            
            ctx.save();
            if (!state.player.facingRight) {
                ctx.translate(state.player.x, state.player.y);
                ctx.scale(-1, 1);
                ctx.translate(-state.player.x, -state.player.y);
            }
            ctx.drawImage(playerSprite, x, y, size, size);
            ctx.restore();
        }
        
        const playerCell = { x: state.player.cellX, y: state.player.cellY };
        const lightRadius = 1.0;
        const lightRadiusSmooth = lightRadius * 1.5;
        
        for (let y = startTileY; y <= endTileY; y++) {
            for (let x = startTileX; x <= endTileX; x++) {
                const cell = { x, y };
                let fogAlpha = CONSTANTS.FOG_UNVISITED;
                
                if (state.visited[y][x]) {
                    const dx = cell.x - playerCell.x;
                    const dy = cell.y - playerCell.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist <= lightRadiusSmooth) {
                        fogAlpha = CONSTANTS.FOG_LIGHT;
                    } else {
                        fogAlpha = CONSTANTS.FOG_VISITED;
                    }
                }
                
                if (fogAlpha > 0) {
                    const worldX = x * cellSize;
                    const worldY = y * cellSize;
                    ctx.fillStyle = `rgba(0, 0, 0, ${fogAlpha})`;
                    ctx.fillRect(worldX, worldY, cellSize, cellSize);
                }
            }
        }
        
        ctx.restore();
        
        HUDRenderer.render(state, ctx);
        RadarRenderer.render(state, ctx);
        EffectsRenderer.render(state, ctx, dt);
    }
}
