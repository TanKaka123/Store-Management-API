import { WebSocketServer } from "ws";

const WEBSOCKET_PORT = 8080;

export class WebSocketManager {
  public static instance: WebSocketManager;
  public wss: WebSocketServer;

  constructor() {
    this.wss = new WebSocketServer({ port: WEBSOCKET_PORT });
  }

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  public getServer() {
    return this.wss;
  }
}

const wssManager = WebSocketManager.getInstance();
export default wssManager;
