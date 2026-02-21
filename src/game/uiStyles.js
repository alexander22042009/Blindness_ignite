import { UIConfig } from './uiConfig.js';

export function applyUIStyles() {
    const style = document.createElement('style');
    style.id = 'dynamic-ui-styles';
    
    const start = UIConfig.startScreen;
    const complete = UIConfig.levelCompleteScreen;
    const win = UIConfig.winScreen;
    
    style.textContent = `
        .screen-content {
            padding: ${start.screenPadding}px;
        }
        
        .screen-content h1 {
            font-size: ${start.titleFontSize}px;
            color: ${start.titleColor};
        }
        
        .screen-content h2 {
            font-size: ${complete.titleFontSize}px;
            color: ${complete.titleColor};
        }
        
        .screen-content p {
            font-size: ${start.instructionFontSize}px;
            color: ${start.instructionColor};
        }
        
        .overlay {
            background: ${start.overlayBackground};
        }
        
        .key {
            width: ${start.keySize}px;
            height: ${start.keySize}px;
            background: ${start.keyBackground};
            border: ${start.keyBorder};
            border-radius: ${start.keyBorderRadius}px;
            font-size: ${start.keyFontSize}px;
            color: ${start.keyColor};
        }
        
        .key-row {
            gap: ${start.keyGap}px;
        }
        
        .btn-primary {
            padding: ${start.buttonPadding};
            font-size: ${start.buttonFontSize}px;
            background: ${start.buttonBackground};
            color: ${start.buttonColor};
            border: ${start.buttonBorder};
            border-radius: ${start.buttonBorderRadius};
        }
        
        .btn-primary:hover {
            background: ${start.buttonHoverBackground};
        }
        
        .btn-primary:active {
            background: ${start.buttonActiveBackground};
        }
        
        #winStats {
            margin: ${win.statsMargin}px 0;
            font-size: ${win.statsFontSize}px;
        }
        
        #winStats p {
            margin: ${win.statsItemMargin}px 0;
            color: ${win.statsColor};
        }
        
        #winStats span {
            color: ${win.statsHighlightColor};
        }
    `;
    
    const existing = document.getElementById('dynamic-ui-styles');
    if (existing) {
        existing.replaceWith(style);
    } else {
        document.head.appendChild(style);
    }
}
