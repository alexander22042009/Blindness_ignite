# Blindness - Game Specification

## Core Mechanics

### Maze Generation
- Perfect maze using DFS/recursive backtracking
- Grid-based: 0 = wall, 1 = passage
- Odd dimensions only (auto-corrected)
- Start at (1, H-2)

### Fog-of-War
- Unvisited: 95% fog
- Visited (outside radius): 50% fog
- In light radius: 20% fog
- Light radius: 3-5 cells (level-dependent)

### Radar
- Always visible (bottom-right)
- Mini-map window (5-7 cell radius)
- Compass arrow to current target
- Target: nearest uncollected key, or door when all keys collected
- Stability threshold: 1.5 cells

### Movement
- Smooth pixel-based (not tile-by-tile)
- WASD + arrow keys
- Collision with walls
- Keys/doors don't block movement

### Camera
- Player centered in viewport
- World scrolls with player position
- Clamped to world bounds

### Scoring
- Level multiplier: 1 + (L-1) * 0.35 (L=1..5)
- Key: 100 * multiplier
- Door: 300 * multiplier
- Time bonus: (TargetTime - Time) * 5 * multiplier (if Time <= TargetTime)
- Streak bonus: 50 * multiplier (if next key < 20s after previous)

### Levels
- Level 0: Tutorial (19x19, lightRadius=6)
- Levels 1-5: Progressive difficulty
- Increasing size, decreasing light radius

### Door Animation
- 0.5s arrival animation when player reaches door with all keys
- Input frozen during animation
- Then level complete
