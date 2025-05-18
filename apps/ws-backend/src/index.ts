import { WebSocketServer, WebSocket } from "ws";
import { JWT_SECRET } from "@repo/backend-common/config";

import jwt from "jsonwebtoken";


const wss = new WebSocketServer({ port: 8000 });
 
type User = {
  userId: string;
  ws: WebSocket;
  rooms: number[];
};

const users: User[] = [];

function checkUser(token: string): string | null {
  const decodedToken = jwt.verify(token, JWT_SECRET);
  if (typeof decodedToken === "string") {
    return null;
  }
  if (!decodedToken || !decodedToken.userId) {
    return null;
  }
  return decodedToken.userId;
}

wss.on("connection", (ws,request) => {

  const url = request.url;
  if (!url) {
    return ws.close();
  }
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  if (!token) {
    return ws.close();
  }
  const userId = checkUser(token);
  if (!userId) {
    return ws.close();
  }

  users.push({ userId, ws, rooms: [] });

  ws.on("message", async (message) => {
    
  });  
  

});