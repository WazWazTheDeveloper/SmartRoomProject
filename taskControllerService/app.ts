import { deviceDBHandler } from "./src/handlers/deviceDBHandler";
import { taskDBHandler } from "./src/handlers/taskDBHandler";
import { taskCheckHandler } from "./src/handlers/taskHandler";
import { initializeDeviceHandler } from "./src/services/deviceService";
import { connectToDatabase } from "./src/services/mongoDBService"
import { initializeTaskHandler, initializeTasksFromDB } from "./src/services/taskService";

async function startServer() {
    await connectToDatabase()
    await initializeDeviceHandler(deviceDBHandler);
    await initializeTaskHandler(taskDBHandler);
    await initializeTasksFromDB(taskCheckHandler);
}

startServer()