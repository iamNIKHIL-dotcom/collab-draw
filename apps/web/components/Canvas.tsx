"use client";

import { Canvas } from "@/app/draw/Canvas";
import { useEffect,useRef,useState } from "react";

export default function CanvasRenderer({
    roomId,
    socket,
} :{
    roomId :string,
    socket :WebSocket,
}){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvas, setCanvas ] = useState<Canvas>();


    useEffect(() =>{
        let c : Canvas;
        if(canvasRef.current){
            c = new Canvas(canvasRef.current, roomId,socket);
            setCanvas(c);

        }
        const disableScroll = (e :Event) => e.preventDefault();
        document.body.style.overflow = "hidden";

        document.addEventListener("wheel", disableScroll, {
            passive : false
        });

        return () => {
            document.body.style.overflow = "auto";
            document.removeEventListener("wheel", disableScroll);
            c?.destroy();
        };


    },[roomId, socket])

    return(
        <div>
            
            <canvas 
                ref = { canvasRef }
                className="fixed top-0 left-0 w-screen h-screen"
            />


        </div>
    )
}