export class Input {
    constructor() {
        this.keys = {};
        this.keysPressed = {};
        this.keysReleased = {};
        
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));
    }
    
    onKeyDown(e) {
        if (!this.keys[e.code]) {
            this.keysPressed[e.code] = true;
        }
        this.keys[e.code] = true;
    }
    
    onKeyUp(e) {
        this.keysReleased[e.code] = true;
        this.keys[e.code] = false;
    }
    
    update() {
        this.keysPressed = {};
        this.keysReleased = {};
    }
    
    isPressed(code) {
        return !!this.keysPressed[code];
    }
    
    isDown(code) {
        return !!this.keys[code];
    }
    
    isReleased(code) {
        return !!this.keysReleased[code];
    }
    
    getMovement() {
        let dx = 0;
        let dy = 0;
        
        if (this.isDown('KeyW') || this.isDown('ArrowUp')) dy -= 1;
        if (this.isDown('KeyS') || this.isDown('ArrowDown')) dy += 1;
        if (this.isDown('KeyA') || this.isDown('ArrowLeft')) dx -= 1;
        if (this.isDown('KeyD') || this.isDown('ArrowRight')) dx += 1;
        
        if (dx !== 0 && dy !== 0) {
            dx *= 0.707;
            dy *= 0.707;
        }
        
        return { dx, dy };
    }
}
