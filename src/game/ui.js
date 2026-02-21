export function showStartScreen() {
    document.getElementById('startScreen').classList.remove('hidden');
    document.getElementById('levelCompleteScreen').classList.add('hidden');
    document.getElementById('winScreen').classList.add('hidden');
    document.getElementById('videoScreen').classList.add('hidden');
}

export function showLevelCompleteScreen() {
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('levelCompleteScreen').classList.remove('hidden');
    document.getElementById('winScreen').classList.add('hidden');
    document.getElementById('videoScreen').classList.add('hidden');
}

export function showWinScreen() {
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('levelCompleteScreen').classList.add('hidden');
    document.getElementById('winScreen').classList.remove('hidden');
    document.getElementById('videoScreen').classList.add('hidden');
}

export function showVideoScreen() {
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('levelCompleteScreen').classList.add('hidden');
    document.getElementById('winScreen').classList.add('hidden');
    document.getElementById('videoScreen').classList.remove('hidden');
}

export function hideAllScreens() {
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('levelCompleteScreen').classList.add('hidden');
    document.getElementById('winScreen').classList.add('hidden');
    document.getElementById('videoScreen').classList.add('hidden');
}
