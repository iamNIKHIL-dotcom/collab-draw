"use client";
import { useSocket } from "@/hooks/useSocket";
import { useEffect } from "react";
import Canvas from "./Canvas";

export function CanvasWrapper({ roomId }: { roomId: string }) {
  const { socket, loading } = useSocket();

  useEffect(() =>{

  }, [socket, roomId, loading]);

  if(loading){
    return <div>
      Loading...
    </div>
  }

  if(!socket){
    return <div>
      Connecting to server...
    </div>
  }
  return <Canvas roomId={roomId} socket={socket} />;
}
