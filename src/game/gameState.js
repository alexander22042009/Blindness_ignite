import { generateMazeDFS } from './mazeGenerator.js';
import { placeKeys, placeDoorFarthestByBFS, placeGems } from './placement.js';
import { initVisited, markVisited, isInLightRadius } from './fog.js';
import { clampPosition } from './collision.js';
import { Player } from './entities.js';
import { chooseTarget, resetRadar } from './radar.js';
import { pointsForKey, pointsForDoor, timeBonus, streakBonus, pointsForGem, gemCompletionBonus } from './scoring.js';
import { CONSTANTS } from './constants.js';
import { RNG } from '../core/rng.js';
import { LEVEL_CONFIGS } from './levelConfig.js';
import { LevelCompleteState } from './state.js';
import { Renderer } from '../render/renderer.js';
import { UIConfig } from './uiConfig.js';

export class GameState {
    constructor(engine, levelIndex) {
        this.engine = engine;
        this.levelIndex = levelIndex;
        this.config = null;
        this.grid = null;
        this.w = 0;
        this.h = 0;
        this.cellSize = 32;
        this.player = null;
        this.keys = [];
        this.gems = [];
        this.gemsCollected = 0;
        this.gemsTotal = 0;
        this.door = null;
        this.doorUnlocked = false;
        this.doorTransition = { isPlaying: false, timerMs: 0 };
        this.visited = null;
        this.levelStartTime = 0;
        this.levelTime = 0;
        this.keysCollected = 0;
        this.lastKeyTime = 0;
        this.score = 0;
        this.totalScore = 0;
        this.totalTime = 0;
        this.floatingEffects = [];
        this.cameraX = 0;
        this.cameraY = 0;
    }
    
    enter() {
        this.config = LEVEL_CONFIGS[this.levelIndex];
        
        const start = { x: 1, y: this.config.h - 2 };
        const rng = new RNG(Date.now() + this.levelIndex);
        const result = generateMazeDFS(this.config.w, this.config.h, start, rng);
        
        this.grid = result.grid;
        this.w = result.w;
        this.h = result.h;
        this.cellSize = this.config.cellSize;
        
        this.door = placeDoorFarthestByBFS(this.grid, result.start);
        this.keys = placeKeys(this.grid, result.start, this.door, 2, rng);
        
        this.gemsTotal = rng.int(this.config.gemMinCount, this.config.gemMaxCount);
        this.gems = placeGems(this.grid, result.start, this.keys, this.door, this.gemsTotal, rng);
        this.gemsCollected = 0;
        
        const startX = result.start.x * this.cellSize + this.cellSize / 2;
        const startY = result.start.y * this.cellSize + this.cellSize / 2;
        this.player = new Player(startX, startY, this.cellSize);
        this.player.input = this.engine.input;
        
        this.visited = initVisited(this.w, this.h);
        markVisited(this.visited, { x: result.start.x, y: result.start.y });
        
        this.levelStartTime = performance.now() / 1000;
        this.levelTime = 0;
        this.keysCollected = 0;
        this.lastKeyTime = 0;
        this.score = 0;
        this.doorUnlocked = false;
        this.doorTransition = { isPlaying: false, timerMs: 0 };
        this.floatingEffects = [];
        
        resetRadar();
        
        this.updateCamera();
    }
    
    exit() {
    }
    
    update(dt) {
        const effectConfig = UIConfig.effects;
        for (let i = this.floatingEffects.length - 1; i >= 0; i--) {
            const effect = this.floatingEffects[i];
            effect.y -= effectConfig.floatingSpeed * dt;
            effect.life -= dt;
            if (effect.life <= 0) {
                this.floatingEffects.splice(i, 1);
            }
        }
        
        if (this.doorTransition.isPlaying) {
            this.doorTransition.timerMs += dt;
            if (this.doorTransition.timerMs >= CONSTANTS.DOOR_ANIMATION_DURATION) {
                this.doorTransition.isPlaying = false;
                this.doorUnlocked = true;
                this.completeLevel();
            }
            return;
        }
        
        this.levelTime = (performance.now() / 1000) - this.levelStartTime;
        
        const worldWidth = this.w * this.cellSize;
        const worldHeight = this.h * this.cellSize;
        this.player.update(dt, this.config.playerSpeed, this.grid, worldWidth, worldHeight);
        
        if (this.player.enteredNewCell()) {
            const cell = { x: this.player.cellX, y: this.player.cellY };
            markVisited(this.visited, cell);
            
            for (let i = 0; i < this.keys.length; i++) {
                const key = this.keys[i];
                if (!key.collected && key.x === cell.x && key.y === cell.y) {
                    key.collected = true;
                    this.keysCollected++;
                    
                    const level = this.levelIndex === 0 ? 1 : this.levelIndex;
                    const pts = pointsForKey(level);
                    this.score += pts;
                    this.totalScore += pts;
                    
                    if (this.lastKeyTime > 0) {
                        const timeSinceLast = this.levelTime - this.lastKeyTime;
                        if (timeSinceLast < CONSTANTS.STREAK_TIME_THRESHOLD) {
                            const streakPts = streakBonus(level);
                            this.score += streakPts;
                            this.totalScore += streakPts;
                            this.addFloatingEffect(this.player.x, this.player.y, `+${streakPts.toFixed(0)}pt`);
                        }
                    }
                    
                    this.addFloatingEffect(this.player.x, this.player.y, `+${pts.toFixed(0)}pt`);
                    this.lastKeyTime = this.levelTime;
                }
            }
            
            for (let i = 0; i < this.gems.length; i++) {
                const gem = this.gems[i];
                if (!gem.collected && gem.x === cell.x && gem.y === cell.y) {
                    gem.collected = true;
                    this.gemsCollected++;
                    
                    const level = this.levelIndex === 0 ? 1 : this.levelIndex;
                    const pts = pointsForGem(level);
                    this.score += pts;
                    this.totalScore += pts;
                    
                    this.addFloatingEffect(this.player.x, this.player.y, `+${pts.toFixed(0)}pt`);
                }
            }
            
            if (this.keysCollected === 2 && 
                this.door.x === cell.x && 
                this.door.y === cell.y &&
                !this.doorUnlocked &&
                !this.doorTransition.isPlaying) {
                this.doorTransition.isPlaying = true;
                this.doorTransition.timerMs = 0;
            }
        }
        
        this.updateCamera();
    }
    
    updateCamera() {
        const worldW = this.w * this.cellSize;
        const worldH = this.h * this.cellSize;
        const viewW = this.engine.canvas.width;
        const viewH = this.engine.canvas.height;
        
        this.cameraX = this.player.x - viewW / 2;
        this.cameraY = this.player.y - viewH / 2;
        
        this.cameraX = Math.max(0, Math.min(this.cameraX, worldW - viewW));
        this.cameraY = Math.max(0, Math.min(this.cameraY, worldH - viewH));
    }
    
    addFloatingEffect(x, y, text) {
        this.floatingEffects.push({
            x,
            y,
            text,
            life: UIConfig.effects.floatingLifetime,
            alpha: 1.0
        });
    }
    
    completeLevel() {
        const level = this.levelIndex === 0 ? 1 : this.levelIndex;
        const doorPts = pointsForDoor(level);
        const timeBonusPts = timeBonus(level, this.levelTime, this.config.targetTime);
        const gemBonusPts = gemCompletionBonus(level, this.gemsCollected, this.gemsTotal);
        
        this.score += doorPts + timeBonusPts + gemBonusPts;
        this.totalScore += doorPts + timeBonusPts + gemBonusPts;
        this.totalTime += this.levelTime;
        
        if (timeBonusPts > 0) {
            this.addFloatingEffect(this.player.x, this.player.y, `+${timeBonusPts.toFixed(0)}pt`);
        }
        if (gemBonusPts > 0) {
            this.addFloatingEffect(this.player.x, this.player.y, `+${gemBonusPts.toFixed(0)}pt`);
        }
        
        this.engine.setState(new LevelCompleteState(this.engine, this));
    }
    
    render(ctx, dt) {
        Renderer.render(this, ctx, dt);
    }
}
