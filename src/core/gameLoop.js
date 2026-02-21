import { Time } from './time.js';

export class GameLoop {
    constructor(updateFn, renderFn) {
        this.updateFn = updateFn;
        this.renderFn = renderFn;
        this.running = false;
        this.lastTime = 0;
    }
    
    start() {
        if (this.running) return;
        this.running = true;
        this.lastTime = performance.now();
        this.tick();
    }
    
    stop() {
        this.running = false;
    }
    
    tick() {
        if (!this.running) return;
        
        const now = performance.now();
        const dt = (now - this.lastTime) / 1000;
        this.lastTime = now;
        
        Time.deltaTime = Math.min(dt, 0.1);
        Time.totalTime += Time.deltaTime;
        
        this.updateFn(Time.deltaTime);
        this.renderFn(Time.deltaTime);
        
        requestAnimationFrame(() => this.tick());
    }
}
