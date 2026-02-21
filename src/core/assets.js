import { Sprites } from '../render/sprites.js';

const SPRITE_NAMES = [
    'hero1',
    'hero2',
    'path',
    'wall',
    'key',
    'gem',
    'door_closed',
    'door_opened',
    'door-opening_halfSec'
];

export async function loadAssets() {
    const images = {};
    
    for (const name of SPRITE_NAMES) {
        images[name] = await loadImage(name);
    }
    
    Sprites.init(images);
    return images;
}

function loadImage(name) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => {
            const placeholder = createPlaceholder(name);
            resolve(placeholder);
        };
        img.src = `assets/images/${name}.png`;
    });
}

function createPlaceholder(name) {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    const colors = {
        hero1: '#00ff00',
        hero2: '#00cc00',
        path: '#333333',
        wall: '#666666',
        key: '#ffaa00',
        gem: '#00ffff',
        door_closed: '#880000',
        door_opened: '#008800',
        'door-opening_halfSec': '#ffff00'
    };
    
    ctx.fillStyle = colors[name] || '#ffffff';
    ctx.fillRect(0, 0, 32, 32);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, 30, 30);
    
    const img = new Image();
    img.src = canvas.toDataURL();
    return img;
}
