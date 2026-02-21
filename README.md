# Blindness

A 2D top-down exploration game in a procedurally generated dark maze.

## How to Run

Open `index.html` in a modern web browser. No build tools required.

## Controls

- **W** / **↑** - Move up
- **A** / **←** - Move left
- **S** / **↓** - Move down
- **D** / **→** - Move right

## Objective

1. Find 3 keys scattered in the maze
2. Once all keys are collected, reach the door
3. Complete all 6 levels (0-5)

## Features

- Procedurally generated perfect mazes
- Fog-of-war system (dark exploration)
- Radar with mini-map and compass
- Scoring system with time bonuses
- Smooth player movement
- Camera follows player

## Assets

Place sprite images (1x1 tiles) in `/assets/images/`:
- `player_0.png`, `player_1.png`
- `floor.png`, `wall.png`
- `key.png`
- `door_locked.png`, `door_unlocked.png`, `door_arrive.png`

See `/assets/images/sprite-naming.txt` for details.
