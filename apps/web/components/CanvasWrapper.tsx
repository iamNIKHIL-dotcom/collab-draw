
import { Socket } from "dgram"
import { useEffect } from "react"
import Canvas from "./Canvas";


export function CanvasWrapper({ roomId }: {
    roomId :string
}) {


  return (
    <Canvas roomId = { roomId } socket = { socket } />;
  )
}

