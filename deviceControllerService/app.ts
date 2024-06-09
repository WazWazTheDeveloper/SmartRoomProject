import { deviceDBHandler } from "./src/handlers/deviceDBHandler";
import { initDeviceSubscriptions } from "./src/handlers/mqttDeviceSubscriptionsHandler";
import { mqttMessageHandler } from "./src/handlers/mqttHandler";
import { mqttTopicDBHandler } from "./src/handlers/mqttTopicDBHandler";
import { initCheckConnection } from "./src/scheduledFunctions/checkConnectionTask";
import { initializeDeviceHandler } from "./src/services/deviceService";
import { connectToDatabase } from "./src/services/mongoDBService";
import { initializeMqttClient } from "./src/services/mqttClientService";
import { initializeMqttTopicHandler } from "./src/services/mqttTopicService";

async function startServer(): Promise<void> {
    await connectToDatabase()
    await initializeDeviceHandler(deviceDBHandler);
    await initializeMqttTopicHandler(mqttTopicDBHandler)
    initializeMqttClient(mqttMessageHandler);
    initCheckConnection();
    initDeviceSubscriptions();
}

startServer();