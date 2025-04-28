import Room from './Room.js';
import RoomGrids from './rooms.js';

export function CreateRoomTemplates(canvas, ctx, enemyTypes) {
    return RoomGrids.map(roomConfig => 
        new Room(
            canvas,
            ctx,
            roomConfig.grid,
            roomConfig.backgroundTexture,
            roomConfig.wallTexture,
            enemyTypes
        )
    );
}