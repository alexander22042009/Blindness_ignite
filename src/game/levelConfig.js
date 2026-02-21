const CELL_SIZE = 256;
const PLAYER_SPEED_MULTIPLIER = 4.0;

export const LEVEL_CONFIGS = [
    {
        w: 19,
        h: 19,
        lightRadius: 6,
        radarRadius: 7,
        targetTime: 140,
        cellSize: CELL_SIZE,
        playerSpeed: CELL_SIZE * PLAYER_SPEED_MULTIPLIER,
        gemMinCount: 20,
        gemMaxCount: 40
    },
    {
        w: 25,
        h: 25,
        lightRadius: 5,
        radarRadius: 7,
        targetTime: 120,
        cellSize: CELL_SIZE,
        playerSpeed: CELL_SIZE * PLAYER_SPEED_MULTIPLIER,
        gemMinCount: 30,
        gemMaxCount: 60
    },
    {
        w: 35,
        h: 35,
        lightRadius: 4,
        radarRadius: 6,
        targetTime: 110,
        cellSize: CELL_SIZE,
        playerSpeed: CELL_SIZE * PLAYER_SPEED_MULTIPLIER,
        gemMinCount: 40,
        gemMaxCount: 80
    },
    {
        w: 45,
        h: 35,
        lightRadius: 3,
        radarRadius: 5,
        targetTime: 100,
        cellSize: CELL_SIZE,
        playerSpeed: CELL_SIZE * PLAYER_SPEED_MULTIPLIER,
        gemMinCount: 50,
        gemMaxCount: 100
    },
    {
        w: 51,
        h: 41,
        lightRadius: 3,
        radarRadius: 5,
        targetTime: 90,
        cellSize: CELL_SIZE,
        playerSpeed: CELL_SIZE * PLAYER_SPEED_MULTIPLIER,
        gemMinCount: 60,
        gemMaxCount: 120
    },
    {
        w: 61,
        h: 51,
        lightRadius: 2,
        radarRadius: 4,
        targetTime: 80,
        cellSize: CELL_SIZE,
        playerSpeed: CELL_SIZE * PLAYER_SPEED_MULTIPLIER,
        gemMinCount: 80,
        gemMaxCount: 150
    }
];
