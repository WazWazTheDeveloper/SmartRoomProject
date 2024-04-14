import express = require('express');
const cookieParser = require('cookie-parser')
import bodyParser = require('body-parser');
import { deviceDBHandler } from "./src/handlers/deviceDBHandler";
import { taskCheckHandler } from "./src/handlers/taskHandler";
import { connectToDatabase } from "./src/services/mongoDBService";
import { initializeDeviceHandler } from "./src/services/deviceService";
import { initializeTasksFromDB} from "./src/services/taskService";
import { routerv1 } from './src/routes/v1/router';
import { mqttMessageHandler } from './src/handlers/mqttHandler';
import { initializeMqttClient } from './src/services/mqttClientService';
import { initDeviceSubscriptions } from './src/handlers/mqttDeviceSubscriptionsHandler';
import { initializeMqttTopicHandler } from './src/services/mqttTopicService';
import { mqttTopicDBHandler } from './src/handlers/mqttTopicDBHandler';
import { addRequestID } from './src/middleware/requestID';
import { httpRequestLogger } from './src/middleware/requestLogger';
import { loggerGeneral } from './src/services/loggerService';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(addRequestID)
app.use(httpRequestLogger)

app.use('/api/v1', routerv1);

async function startServer(): Promise<void> {
    await connectToDatabase()
    await initializeDeviceHandler(deviceDBHandler);
    await initializeTasksFromDB(taskCheckHandler);
    await initializeMqttTopicHandler(mqttTopicDBHandler)
    initializeMqttClient(mqttMessageHandler);

    startListeningToReqests()
    initDeviceSubscriptions();
}

function startListeningToReqests(): void {
    let server = app.listen(process.env.SERVER_PORT, () => {
        loggerGeneral.info(`listening on port ${process.env.SERVER_PORT}`,{uuid : "server-startup"})
    })

}

startServer();