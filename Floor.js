import Room from './Room.js';

export default class Floor {
    constructor(canvas, ctx, roomTemplates) {
        this.Canvas = canvas;
        this.ctx = ctx;
        this.RoomTemplates = roomTemplates;
        this.currentX = 0;
        this.currentY = 0;

        this.GenerateFloor();
    }

    GenerateFloor() {
        const gridSize = 7;
        const targetRoomCount = Math.floor(gridSize * gridSize * (0.2 + Math.random() * 0.1));
        this.Rooms = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));

        let x = Math.floor(gridSize / 2);
        let y = Math.floor(gridSize / 2);
        this.currentX = x;
        this.currentY = y;
        
        // Place first room
        this.Rooms[y][x] = this.CopyRoom(this.RoomTemplates[0]);
        let roomCount = 1;

        const maxIterations = gridSize * gridSize * 10;
        let iterations = 0;

        while (roomCount < targetRoomCount && iterations < maxIterations) {
            iterations++;
            const direction = Math.floor(Math.random() * 4);
            
            if (direction === 0 && x > 0 && !this.Rooms[y][x - 1]) x--;
            if (direction === 1 && x < gridSize - 1 && !this.Rooms[y][x + 1]) x++;
            if (direction === 2 && y > 0 && !this.Rooms[y - 1][x]) y--;
            if (direction === 3 && y < gridSize - 1 && !this.Rooms[y + 1][x]) y++;

            if (!this.Rooms[y][x]) {
                const randomTemplate = this.RoomTemplates[
                    Math.floor(Math.random() * (this.RoomTemplates.length - 1)) + 1
                ];
                this.Rooms[y][x] = this.CopyRoom(randomTemplate);
                roomCount++;
            }
        }
    }

    CopyRoom(roomTemplate) {
        const room = new Room(
            this.Canvas,
            this.ctx,
            roomTemplate.Grid,
            roomTemplate.Background,
            roomTemplate.Walls,
            roomTemplate.EnemyTypes
        );
        return room;
    }

    MoveToRoom(direction) {
        if (!this.CanMoveToRoom(direction)) return false;
        
        const newX = this.currentX + (direction === 'right' ? 1 : direction === 'left' ? -1 : 0);
        const newY = this.currentY + (direction === 'down' ? 1 : direction === 'up' ? -1 : 0);
        
        this.currentX = newX;
        this.currentY = newY;
        return true;
    }
    
    CanMoveToRoom(direction) {
        const newX = this.currentX + (direction === 'right' ? 1 : direction === 'left' ? -1 : 0);
        const newY = this.currentY + (direction === 'down' ? 1 : direction === 'up' ? -1 : 0);
        
        return newX >= 0 && 
               newX < this.Rooms[0].length &&
               newY >= 0 && 
               newY < this.Rooms.length &&
               this.Rooms[newY][newX] !== null &&
               this.Rooms[newY][newX].Iscleared;
    }

    GetCurrentRoom() {
        return this.Rooms[this.currentY][this.currentX];
    }
}