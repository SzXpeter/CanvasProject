import Room from './Room.js';

export default class Floor {
    constructor(canvas, ctx, roomTemplates, boss) {
        this.Canvas = canvas;
        this.ctx = ctx;
        this.RoomTemplates = roomTemplates;
        this.CurrentX = 0;
        this.CurrentY = 0;
        this.BossRoom = null;
        this.Boss = boss;

        this.GenerateFloor();
        this.AddBossRoom();
        this.UpdateAllDoors();
    }

    GenerateFloor() {
        const gridSize = 6;
        const targetRoomCount = Math.floor(gridSize * gridSize * (0.2 + Math.random() * 0.1));
        this.Rooms = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));

        let x = Math.floor(gridSize / 2);
        let y = Math.floor(gridSize / 2);
        this.CurrentX = x;
        this.CurrentY = y;
        
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
                    Math.floor(Math.random() * (this.RoomTemplates.length - 2) + 1)
                ];
                this.Rooms[y][x] = this.CopyRoom(randomTemplate);
                roomCount++;
            }
        }
    }

    AddBossRoom() {
        let furthestRoom = { x: this.CurrentX, y: this.CurrentY, dist: 0 };
        
        for (let y = 0; y < this.Rooms.length; y++) {
            for (let x = 0; x < this.Rooms[y].length; x++) {
                if (this.Rooms[y][x]) {
                    const dist = Math.abs(x - this.CurrentX) + Math.abs(y - this.CurrentY);
                    if (dist > furthestRoom.dist) {
                        furthestRoom = { x, y, dist };
                    }
                }
            }
        }
        
        this.BossRoom = { x: furthestRoom.x, y: furthestRoom.y };
        this.Rooms[furthestRoom.y][furthestRoom.x] = this.CopyRoom(this.RoomTemplates[this.RoomTemplates.length - 1]);
        this.Rooms[furthestRoom.y][furthestRoom.x].EnemyTypes = [this.Boss];
    }

    UpdateAllDoors() {
        for (let y = 0; y < this.Rooms.length; y++) {
            for (let x = 0; x < this.Rooms[y].length; x++) {
                if (this.Rooms[y][x]) {
                    const savedX = this.CurrentX;
                    const savedY = this.CurrentY;
                    this.CurrentX = x;
                    this.CurrentY = y;
                    
                    const room = this.Rooms[y][x];
                    room.doors.up = this.HasRoomInDirection('up');
                    room.doors.down = this.HasRoomInDirection('down');
                    room.doors.left = this.HasRoomInDirection('left');
                    room.doors.right = this.HasRoomInDirection('right');
                    
                    this.CurrentX = savedX;
                    this.CurrentY = savedY;
                }
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
        room.Grid = roomTemplate.Grid.map(row => [...row]);
        room.EnemyTypes = [...this.RoomTemplates[0].EnemyTypes];
        return room;
    }

    MoveToRoom(direction) {
        if (!this.CanMoveToRoom(direction)) return false;
        
        const newX = this.CurrentX + (direction === 'right' ? 1 : direction === 'left' ? -1 : 0);
        const newY = this.CurrentY + (direction === 'down' ? 1 : direction === 'up' ? -1 : 0);
        
        this.CurrentX = newX;
        this.CurrentY = newY;
        this.Rooms[this.CurrentY][this.CurrentX].DisableDoors();

        this.ctx.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
        console.log(this.GetCurrentRoom());
        
        return true;
    }
    
    CanMoveToRoom(direction) {
        return this.HasRoomInDirection(direction) && 
               this.Rooms[this.CurrentY][this.CurrentX].Iscleared;
    }

    HasRoomInDirection(direction) {
        const newX = this.CurrentX + (direction === 'right' ? 1 : direction === 'left' ? -1 : 0);
        const newY = this.CurrentY + (direction === 'down' ? 1 : direction === 'up' ? -1 : 0);
        
        return newX >= 0 && 
               newX < this.Rooms[0].length &&
               newY >= 0 && 
               newY < this.Rooms.length &&
               this.Rooms[newY][newX] != null;
    }

    GetCurrentRoom() {
        return this.Rooms[this.CurrentY][this.CurrentX];
    }
}