import { ChatService } from "../services/chat.service";
import { RoomManager } from "./room-manager";
import { WebSocketManager } from "./websocket-manager";
import { v4 as uuidv4 } from "uuid";

export class SocketGateway {
  private chatService: ChatService;
  private wss = WebSocketManager.getInstance().getServer();
  private roomManager = RoomManager.getInstance();

  constructor() {
    this.chatService = new ChatService();

    this.wss.on("connection", (ws) => {
      const wsId = uuidv4();

      ws.on("message", (message: string) => {
        try {
          const { type, room, content, username } = JSON.parse(message);

          if (type === "join") {
            this.roomManager.joinRoom(room, ws as any);
          }
          if (type === "message") {
            this.roomManager.sendMessageToRoom(
              room,
              JSON.stringify({ type: "message", ...content })
            );
          }
        } catch (error) {
          console.error("❌ Invalid message format:", message);
        }
      });

      ws.on("close", () => {
        // this.chatService.removeUser(wsId);
        console.log(`❌ Client disconnected: ${wsId}`);
      });
    });
  }
}
