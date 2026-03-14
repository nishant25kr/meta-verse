import type { User } from "./User";

export class RoomManager{
    rooms: Map<string, User[]> = new Map();
    static instance : RoomManager
    constructor(){
        this.rooms = new Map()
    }

    static getInstance(){
        if(this.instance){
            this.instance = new RoomManager()
        }
        return this.instance;
    }

    public addUser(spaceId: string, userId: User){
        this.rooms.set(spaceId , [...this.rooms.get(spaceId), userId])
    }
    

}