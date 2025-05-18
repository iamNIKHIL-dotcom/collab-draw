import { WebSocketServer, WebSocket } from "ws";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";

import jwt from "jsonwebtoken";


const wss = new WebSocketServer({ port: 8000 });
 //to do: redux for state mang, in be
type User = {
  userId: string;
  ws: WebSocket;
  rooms: number[];
};

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    if (typeof decodedToken === "string") {
      return null;
    }
    if (!decodedToken || !decodedToken.userId) {
      return null;
    }
    return decodedToken.userId;
    
  } catch (error) {
    return null;
  }
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
    //4 types of message-
    // shape-update, join-room, leave, chat
    
    try {
      const data = JSON.parse(message as unknown as string);

      if (data.type === "shape_update") {
        const roomId = Number(data.roomId);
        if (!roomId) {
          return;
        }

        // First verify the user is in the room
        const userRoom = users.find((user) => user.userId === userId);
        if (!userRoom || !userRoom.rooms.includes(roomId)) {
          return;
        }

        // Save to database
        await prismaClient.chat.create({
          data: {
            roomId,
            message: data.message,
            userId,
          },
        });

        // Broadcast to ALL users in the room, including sender
        users.forEach((user) => {
          if (user.rooms.includes(roomId)) {
            user.ws.send(
              JSON.stringify({
                type: "shape_update",
                message: data.message,
                roomId,
                userId: userId, // Include userId to identify who made the change
              })
            );
          }
        });
      }

      if (data.type === "join") {
        const roomId = Number(data.roomId);
        if (!roomId) {
          return ws.close();
        }
        //users-->data structure
        const userRoom = users.find((user) => user.userId === userId);
        if (!userRoom) {
          return ws.close();
        }
        userRoom.rooms.push(roomId);
        ws.send(JSON.stringify({ type: "join", roomId }));
      }

      if (data.type === "leave") {
        const roomId = Number(data.roomId);
        if (!roomId) {
          return;
        }
        const userRoom = users.find((user) => user.userId === userId);
        if (!userRoom) {
          return;
        }
        userRoom.rooms = userRoom.rooms.filter((id) => id !== roomId);
        ws.send(JSON.stringify({ type: "leave", roomId }));
      }

      if (data.type === "chat") {
        const roomId = Number(data.roomId);
        const message = data.message;
        console.log(data);
        if (!roomId || !message) {
          return;
        }

        await prismaClient.chat.create({
          data: {
            roomId,
            message,
            userId,
          },
        });
        console.log(users);
        users.forEach((user) => {
          if (user.rooms.includes(roomId)) {
            user.ws.send(JSON.stringify({ type: "chat", message, roomId }));
          }
        });
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });  



  ws.on("close", () => {
    const index = users.findIndex((user) => user.userId === userId);
    if (index !== -1) {
      users.splice(index, 1);
    }
  });


});