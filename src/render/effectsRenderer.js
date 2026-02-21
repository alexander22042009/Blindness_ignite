import { UIConfig } from '../game/uiConfig.js';

export class EffectsRenderer {
    static render(state, ctx, dt) {
        const config = UIConfig.effects;
        ctx.save();
        ctx.translate(-state.cameraX, -state.cameraY);
        
        for (const effect of state.floatingEffects) {
            const alpha = Math.min(1.0, effect.life / config.floatingLifetime);
            const color = config.floatingTextColor;
            const rgb = color.startsWith('#') ? hexToRgb(color) : { r: 255, g: 255, b: 0 };
            ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
            ctx.font = `bold ${config.floatingFontSize}px ${config.floatingFontFamily}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(effect.text, effect.x, effect.y);
        }
        
        ctx.restore();
    }
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 0 };
}
