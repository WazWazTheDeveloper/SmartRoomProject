import * as cron from 'node-cron';
import { loggerGeneral } from '../services/loggerService';
import { bulkWriteCollection } from '../services/mongoDBService';
import { sendCheckConnectionRequest } from '../mqttMessages/outgoing/mqttCheckConnectionRequest';


export function initCheckConnection() {
    loggerGeneral.info("started Check Connection job", { uuid: "server-startup" })
    cron.schedule("*/5 * * * * *", CheckConnection)
}

async function CheckConnection() {
    const updateList = [
        {
            updateMany:
            {
                filter: {
                    isConnectedCheck: false
                },
                update: {
                    $set: {
                        isConnected: false
                    }
                },
            }
        }, {
            updateMany:
            {
                filter: {},
                update: {
                    $set: {
                        isConnectedCheck: false
                    }
                },
            }
        }
    ]
    await bulkWriteCollection('devices', updateList);
    sendCheckConnectionRequest()
}