import Websocket,{ RawData, WebSocketServer } from "ws";
import { AppData } from "./AppData";

const wsServer = new WebSocketServer({ noServer: true });

interface massageType {
    requestType: string // such as addGeneralTopic/removeGeneralTopic
    requestData: JSON //json with args
}

class WebSocketServerHandler {
    public static init():void {
        wsServer.on('connection', async (socket) => {
            let appData = await AppData.getAppDataInstance();

            socket.send(JSON.stringify(appData.getAsJson()));

            console.log("connected new ws")
            socket.on('message', (message:RawData) => {
                WebSocketServerHandler.executeMessage(message)
            });
        });
    }
    public static getWebSocketServer() {
        return wsServer
    }

    public static updateAppdata() {
        wsServer.clients.forEach(async (client) => {
            // Check that connect are open and still alive to avoid socket error
            if (client.readyState === Websocket.OPEN) {
              let appData = await AppData.getAppDataInstance();
              client.send(JSON.stringify(appData.getAsJson()));
            }
          });
    }

    private static executeMessage(message:RawData) {

    }
}

export { WebSocketServerHandler }