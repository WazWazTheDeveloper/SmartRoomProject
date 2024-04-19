import Websocket, { RawData, WebSocketServer } from "ws";
import { AppData } from "../appData";
import { WebsocketUser } from "../models/websocketuser";
import { User } from "../models/user";
var jwt = require('jsonwebtoken');

interface CostumWebsocket extends Websocket {
    user?: User
}


const wsServer = new WebSocketServer({ noServer: true });


class WebSocketServerHandler {
    
    public static init(): void {
        wsServer.on('connection', async (socket: CostumWebsocket) => {

            console.log("connected new ws")
            // console.log(socket.url)
            
            socket.on('message', (message: RawData) => {

                WebSocketServerHandler.executeMessage(socket, message)
            });
        });
    }
    public static getWebSocketServer() {
        return wsServer
    }

    public static updateAppdata() {
        wsServer.clients.forEach(async (client: CostumWebsocket) => {
            // Check that connect are open and still alive to avoid socket error
            if (client.readyState === Websocket.OPEN) {
                if (client.user) {
                    let appData = await AppData.getAppDataInstance();
                    // TODO: filler the data send :)
                    let json = await appData.getAppdataOfUser(client.user);
                    client.send(JSON.stringify(json));
                }
            }
        });
    }

    private static async executeMessage(socket: CostumWebsocket, message: RawData) {
        jwt.verify(
            message.toString(),
            process.env.ACCESS_TOKEN_SECRET,
            // TODO: add type to decoded of somting
            async (err: Error, decoded: any) => {
                if (err) {
                    return
                }
                try {
                    socket.user = await User.getUser(decoded.userInfo.username);
                    let appData = await AppData.getAppDataInstance();
                    let json = await appData.getAppdataOfUser(socket.user);
                    // console.log(json)
                    socket.send(JSON.stringify(json));
                } catch (err) { }
            }
        )
    }
}

export { WebSocketServerHandler }