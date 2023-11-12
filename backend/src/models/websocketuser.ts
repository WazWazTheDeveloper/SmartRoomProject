import { User } from "./user"


class WebsocketUser{
    user : User
    websocket:WebSocket

    constructor(user : User , websocket:WebSocket) {
        this.user = user
        this.websocket = websocket
    }
}

export {WebsocketUser}