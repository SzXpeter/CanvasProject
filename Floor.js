export default class Floor {
    constructor(rooms = [], backgroundTexture, wallTexture, meleeTexture, rangedTexture) {
        this.BackgroundTexture = backgroundTexture;
        this.WallTexture = wallTexture;
        this.MeleeTexture = meleeTexture;
        this.RangedTexture = rangedTexture;

        this.GenerateFloor(rooms);
    }

    GenerateFloor(rooms) {
        const gridSize = 7;
        const targetRoomCount = Math.floor(gridSize * gridSize * (0.2 + Math.random() * 0.1));
        this.Rooms = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));

        let x = Math.floor(gridSize / 2);
        let y = Math.floor(gridSize / 2);
        this.Rooms[y][x] = 1;
        let roomCount = 1;

        const maxIterations = gridSize * gridSize * 10; // Safety limit
        let iterations = 0;

        while (roomCount < targetRoomCount && iterations < maxIterations) {
            iterations++;
            const direction = Math.floor(Math.random() * 4);
            if (direction === 0 && x > 0 && this.Rooms[y][x - 1] === 0) x--;
            if (direction === 1 && x < gridSize - 1 && this.Rooms[y][x + 1] === 0) x++;
            if (direction === 2 && y > 0 && this.Rooms[y - 1][x] === 0) y--;
            if (direction === 3 && y < gridSize - 1 && this.Rooms[y + 1][x] === 0) y++;

            if (this.Rooms[y][x] === 0) {
                this.Rooms[y][x] = Math.floor(Math.random() * rooms.length) + 1;
                roomCount++;
            }
        }

        if (iterations >= maxIterations) {
            console.warn("Room generation stopped due to iteration limit.");
        }
    }
}