import Room from './Room.js';
import Bonk from './Bonk.js';
import RoomGrids from './rooms.js';

export function CreateRoomTemplates(canvas, ctx) {
    const enemyTypes = [
        new Bonk(canvas, ctx)
    ];

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