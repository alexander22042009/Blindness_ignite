import { Engine } from './core/engine.js';
import { loadAssets } from './core/assets.js';
import { StartState } from './game/state.js';
import { applyUIStyles } from './game/uiStyles.js';

let engine = null;

async function init() {
    applyUIStyles();
    
    const canvas = document.getElementById('gameCanvas');
    const assets = await loadAssets();
    
    engine = new Engine(canvas, assets);
    engine.setState(new StartState(engine));
    engine.start();
}

init().catch(console.error);
