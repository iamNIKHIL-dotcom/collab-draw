"use client";


export default function CanvasRenderer({
    roomId,
    socket,
} :{
    roomId :string,
    socket :WebSocket,
}){


    return(
        <div>
            <canvas />


        </div>
    )
}