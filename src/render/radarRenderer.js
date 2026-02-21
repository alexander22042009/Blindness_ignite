import { chooseTarget, computeCompassAngle } from '../game/radar.js';
import { Sprites } from './sprites.js';
import { UIConfig } from '../game/uiConfig.js';

export class RadarRenderer {
    static render(state, ctx) {
        const config = UIConfig.radar;
        const radarSize = config.size;
        const x = ctx.canvas.width - radarSize - config.padding;
        const y = ctx.canvas.height - radarSize - config.padding;
        
        const centerX = x + radarSize / 2;
        const centerY = y + radarSize / 2;
        const radius = radarSize / 2;
        
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.clip();
        
        ctx.fillStyle = config.backgroundColor;
        ctx.fillRect(x, y, radarSize, radarSize);
        
        ctx.restore();
        
        ctx.strokeStyle = config.borderColor;
        ctx.lineWidth = config.borderWidth;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.fillStyle = '#808080';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
        ctx.fill();
        
        const target = chooseTarget(state);
        if (target) {
            let targetPos = null;
            if (target.type === 'key') {
                targetPos = {
                    x: target.obj.x * state.cellSize,
                    y: target.obj.y * state.cellSize
                };
            } else {
                targetPos = {
                    x: state.door.x * state.cellSize,
                    y: state.door.y * state.cellSize
                };
            }
            
            const playerPos = {
                x: state.player.x,
                y: state.player.y
            };
            
            const angle = computeCompassAngle(playerPos, targetPos);
            const arrowLength = radarSize * 0.35;
            const arrowX = centerX + Math.cos(angle) * arrowLength;
            const arrowY = centerY + Math.sin(angle) * arrowLength;
            
            const hudConfig = UIConfig.hud;
            const arrowColor = hudConfig.color;
            
            ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
            ctx.shadowBlur = 8;
            
            ctx.strokeStyle = arrowColor;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(arrowX, arrowY);
            ctx.stroke();
            
            ctx.fillStyle = arrowColor;
            ctx.beginPath();
            ctx.moveTo(arrowX, arrowY);
            ctx.lineTo(
                arrowX - Math.cos(angle - 0.5) * 12,
                arrowY - Math.sin(angle - 0.5) * 12
            );
            ctx.lineTo(
                arrowX - Math.cos(angle + 0.5) * 12,
                arrowY - Math.sin(angle + 0.5) * 12
            );
            ctx.closePath();
            ctx.fill();
            
            ctx.shadowBlur = 0;
        }
    }
}
