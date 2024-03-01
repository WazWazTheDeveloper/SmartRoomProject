import express = require('express');
const cookieParser = require('cookie-parser')
import bodyParser = require('body-parser');
import { logger } from './src/middleware/logger';
import { deviceDBHandler } from "./src/handlers/deviceDBHandler";
import { taskCheckHandler } from "./src/handlers/taskHandler";
import { connectToDatabase } from "./src/services/mongoDBService";
import { initializeDeviceHandler } from "./src/services/deviceService";
import { initializeTasksFromDB, updateTaskProperty } from "./src/services/taskService";
import { routerv1 } from './src/routes/v1/router';
import { mqttMessageHandler } from './src/handlers/mqttHandler';
import { initializeMqttClient } from './src/services/mqttClientService';
import { initDeviceSubscriptions } from './src/handlers/mqttDeviceSubscriptionsHandler';

const app = express();
app.use(logger)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser())

app.use('/api/v1', routerv1);

async function startServer(): Promise<void> {
    await connectToDatabase()
    await initializeDeviceHandler(deviceDBHandler);
    await initializeTasksFromDB(taskCheckHandler);
    initializeMqttClient(mqttMessageHandler);

    startListeningToReqests()
    initDeviceSubscriptions();
}

function startListeningToReqests(): void {
    let server = app.listen(process.env.SERVER_PORT, () => {
        // TODO: logger this:
        console.log(`listening on port ${process.env.SERVER_PORT}`)
    })

}

startServer();