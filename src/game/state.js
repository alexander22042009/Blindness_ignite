import { GameState } from './gameState.js';
import { showStartScreen, showLevelCompleteScreen, showWinScreen, hideAllScreens, showVideoScreen } from './ui.js';
import { maxPossibleForLevel } from './scoring.js';
import { LEVEL_CONFIGS } from './levelConfig.js';
import { UIConfig } from './uiConfig.js';

export class StartState {
    constructor(engine) {
        this.engine = engine;
    }
    
    enter() {
        const config = UIConfig.texts;
        document.querySelector('#startScreen h1').textContent = config.gameTitle;
        document.querySelector('#startScreen p').textContent = config.startScreenInstruction;
        document.getElementById('startBtn').textContent = config.startButton;
        
        showStartScreen();
        document.getElementById('startBtn').onclick = () => {
            hideAllScreens();
            showVideoScreen();
            const video = document.getElementById('introVideo');
            video.currentTime = 0;
            video.play();
            video.onended = () => {
                hideAllScreens();
                this.engine.setState(new GameState(this.engine, 0));
            };
        };
    }
    
    exit() {
        hideAllScreens();
    }
    
    update(dt) {
    }
    
    render(ctx, dt) {
    }
}

export class LevelCompleteState {
    constructor(engine, gameState) {
        this.engine = engine;
        this.gameState = gameState;
    }
    
    enter() {
        const config = UIConfig.texts;
        document.querySelector('#levelCompleteScreen h2').textContent = config.levelCompleteTitle;
        document.getElementById('nextLevelBtn').textContent = config.nextLevelButton;
        
        showLevelCompleteScreen();
        const nextLevel = this.gameState.levelIndex + 1;
        
        document.getElementById('nextLevelBtn').onclick = () => {
            hideAllScreens();
            if (nextLevel <= 5) {
                this.engine.setState(new GameState(this.engine, nextLevel));
            } else {
                this.engine.setState(new WinState(this.engine, this.gameState));
            }
        };
    }
    
    exit() {
        hideAllScreens();
    }
    
    update(dt) {
        this.gameState.update(dt);
    }
    
    render(ctx, dt) {
        this.gameState.render(ctx, dt);
    }
}

export class WinState {
    constructor(engine, gameState) {
        this.engine = engine;
        this.gameState = gameState;
    }
    
    enter() {
        const config = UIConfig.texts;
        let maxPossible = 0;
        for (let i = 0; i <= 5; i++) {
            const level = i === 0 ? 1 : i;
            const levelConfig = LEVEL_CONFIGS[i];
            const avgGems = Math.floor((levelConfig.gemMinCount + levelConfig.gemMaxCount) / 2);
            maxPossible += maxPossibleForLevel(level, levelConfig.targetTime, avgGems);
        }
        
        document.querySelector('#winScreen h2').textContent = config.winTitle;
        document.getElementById('playAgainBtn').textContent = config.playAgainButton;
        
        const stats = document.querySelectorAll('#winStats p');
        stats[0].innerHTML = `${config.totalScoreLabel}: <span id="totalScore">${Math.floor(this.gameState.totalScore)}</span>`;
        stats[1].innerHTML = `${config.totalTimeLabel}: <span id="totalTime">${Math.floor(this.gameState.totalTime)}</span>s`;
        stats[2].innerHTML = `${config.maxScoreLabel}: <span id="maxScore">${Math.floor(maxPossible)}</span>`;
        
        showWinScreen();
        document.getElementById('playAgainBtn').onclick = () => {
            hideAllScreens();
            this.engine.setState(new StartState(this.engine));
        };
    }
    
    exit() {
        hideAllScreens();
    }
    
    update(dt) {
    }
    
    render(ctx, dt) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
}
