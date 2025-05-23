"use client";

import { useEffect,useRef,useState } from "react";

export default function CanvasRenderer({
    roomId,
    socket,
} :{
    roomId :string,
    socket :WebSocket,
}){
    const canvasRef = useRef<HTMLCanvasElement>(null);


    return(
        <div>
            
            <canvas 
                ref = { canvasRef }
                className="fixed top-0 left-0 w-screen h-screen"
            />


        </div>
    )
}