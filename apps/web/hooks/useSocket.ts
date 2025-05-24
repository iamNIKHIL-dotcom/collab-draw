import { getVerifiedToken } from "@/lib/cookie";
import { useEffect, useState } from "react";
import { WS_URL } from "@/config";

export function useSocket(){
    const [ loading, setLoading ] = useState(true);
    const [ socket, setSocket ] = useState<WebSocket | null> (null);

    useEffect(()=>{
        let wsInstance: WebSocket | null = null;
        (async () => {
            try{
                const token = await getVerifiedToken();
                const ws = new WebSocket(`${WS_URL}?token=${token}`);
                wsInstance = ws;

                ws.onopen = () =>{
                    console.log("webSocket connection established");
                    setLoading(false);
                    setSocket(ws);
                };
                ws.onerror = (error) =>{
                    console.log("webSocket error :", error);
                    setLoading(false);
                }
            }catch(error){
                console.error("failed to initialize webSocket: ", error );
                setLoading(false);
            }
        })();
        return () =>{
            if(wsInstance){
                wsInstance.close();
            }
        }
    }, []);

    return {
        socket,
        loading
    };
}