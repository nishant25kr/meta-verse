import { WebSocket } from "ws";
import { RoomManager } from "./RoomManagers";

export class User{

    constructor(private ws: WebSocket){

    }

    initHandler(){
        this.ws.on("message",(data)=>{
            const parsedData = JSON.parse(data.toString());
            switch (parsedData.type) {
                case "join":
                    const spaceId = parsedData.payload.spaceId
                    RoomManager.addUser(this.ws, spaceId)
                    break;
            
                default:
                    break;
            }

        })
    }
}