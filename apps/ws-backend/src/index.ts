import { WebSocketServer, WebSocket } from "ws";


const wss = new WebSocketServer({ port: 8000 });
 
wss.on("connection", (ws) => {

  ws.on("message", async (message) => {
 
  });

});