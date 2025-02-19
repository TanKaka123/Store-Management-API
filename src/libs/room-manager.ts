export class RoomManager {
  private static instance: RoomManager;
  private rooms: Map<string, Set<WebSocket>>;

  constructor() {
    this.rooms = new Map();
  }

  public static getInstance(): RoomManager {
    if (!RoomManager.instance) {
      RoomManager.instance = new RoomManager();
    }
    return RoomManager.instance;
  }

  public joinRoom(roomId: string, ws: WebSocket) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }
    this.rooms.get(roomId)!.add(ws);
    console.log(`📌 Client joined room: ${roomId}`);
  }

  public leaveRoom(roomId: string, ws: WebSocket) {
    if (this.rooms.has(roomId)) {
      this.rooms.get(roomId)!.delete(ws);
      console.log(`❌ Client left room: ${roomId}`);
    }
  }

  public sendMessageToRoom(roomId: string, message: string) {
    if (this.rooms.has(roomId)) {
      this.rooms.get(roomId)!.forEach((user) => {
        if (user.OPEN) {
          user.send(message);
        }
      });
    }
  }
}
