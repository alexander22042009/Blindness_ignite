import { GameLoop } from './gameLoop.js';
import { Input } from './input.js';

export class Engine {
    constructor(canvas, assets) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.assets = assets;
        this.input = new Input();
        this.currentState = null;
        this.loop = null;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    setState(state) {
        if (this.currentState) {
            this.currentState.exit();
        }
        this.currentState = state;
        if (this.currentState) {
            this.currentState.enter();
        }
    }
    
    start() {
        if (this.loop) return;
        this.loop = new GameLoop((dt) => this.update(dt), (dt) => this.render(dt));
        this.loop.start();
    }
    
    stop() {
        if (this.loop) {
            this.loop.stop();
            this.loop = null;
        }
    }
    
    update(dt) {
        this.input.update();
        if (this.currentState) {
            this.currentState.update(dt);
        }
    }
    
    render(dt) {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.currentState) {
            this.currentState.render(this.ctx, dt);
        }
    }
}
