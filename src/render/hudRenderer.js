import { UIConfig } from '../game/uiConfig.js';

export class HUDRenderer {
    static render(state, ctx) {
        const config = UIConfig.hud;
        ctx.font = `${config.fontWeight} ${config.fontSize}px ${config.fontFamily}`;
        ctx.textBaseline = 'middle';
        
        const level = state.levelIndex === 0 ? UIConfig.texts.levelSeedName : state.levelIndex;
        const items = [
            { label: UIConfig.texts.levelLabel, value: level },
            { label: UIConfig.texts.scoreLabel, value: Math.floor(state.totalScore) },
            { label: UIConfig.texts.keysLabel, value: `${state.keysCollected}/2` },
            { label: 'Gems', value: `${state.gemsCollected}/${state.gemsTotal}` },
            { label: UIConfig.texts.timeLabel, value: `${Math.floor(state.levelTime)}s` }
        ];
        
        let x = config.padding;
        const y = config.padding;
        
        for (const item of items) {
            const text = `${item.label}: ${item.value}`;
            ctx.measureText(text);
            const textMetrics = ctx.measureText(text);
            const itemWidth = textMetrics.width + config.itemPadding * 2;
            const itemHeight = config.fontSize + config.itemPadding * 2;
            
            ctx.fillStyle = config.itemBackground;
            ctx.beginPath();
            const r = config.itemBorderRadius;
            ctx.moveTo(x + r, y);
            ctx.lineTo(x + itemWidth - r, y);
            ctx.quadraticCurveTo(x + itemWidth, y, x + itemWidth, y + r);
            ctx.lineTo(x + itemWidth, y + itemHeight - r);
            ctx.quadraticCurveTo(x + itemWidth, y + itemHeight, x + itemWidth - r, y + itemHeight);
            ctx.lineTo(x + r, y + itemHeight);
            ctx.quadraticCurveTo(x, y + itemHeight, x, y + itemHeight - r);
            ctx.lineTo(x, y + r);
            ctx.quadraticCurveTo(x, y, x + r, y);
            ctx.closePath();
            ctx.fill();
            
            ctx.fillStyle = config.color;
            ctx.shadowColor = config.textShadow ? 'rgba(255, 255, 255, 0.5)' : 'transparent';
            ctx.shadowBlur = 8;
            ctx.textAlign = 'left';
            ctx.fillText(text, x + config.itemPadding, y + itemHeight / 2);
            ctx.shadowBlur = 0;
            
            x += itemWidth + config.itemSpacing;
        }
    }
}
