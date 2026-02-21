export class Sprites {
    static images = {};
    
    static init(images) {
        this.images = images;
    }
    
    static get(name) {
        return this.images[name] || null;
    }
}
