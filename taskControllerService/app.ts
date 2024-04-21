import { deviceDBHandler } from "./src/handlers/deviceDBHandler";
import { taskCheckHandler } from "./src/handlers/taskHandler";
import { initializeDeviceHandler } from "./src/services/deviceService";
import { connectToDatabase } from "./src/services/mongoDBService"
import { initializeTasksFromDB } from "./src/services/taskService";

async function startServer() {
    await connectToDatabase()
    await initializeDeviceHandler(deviceDBHandler);
    await initializeTasksFromDB(taskCheckHandler);
}

startServer()