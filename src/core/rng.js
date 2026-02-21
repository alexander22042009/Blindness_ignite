export class RNG {
    constructor(seed = null) {
        this.seed = seed || Date.now();
        this.state = this.seed;
    }
    
    next() {
        this.state = (this.state * 9301 + 49297) % 233280;
        return this.state / 233280;
    }
    
    random() {
        return this.next();
    }
    
    int(min, max) {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }
    
    float(min, max) {
        return this.next() * (max - min) + min;
    }
    
    choice(array) {
        return array[this.int(0, array.length - 1)];
    }
    
    shuffle(array) {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = this.int(0, i);
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }
}
