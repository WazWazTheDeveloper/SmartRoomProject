import { publishMessage } from "../../services/mqttClientService";

/***
 * @description send connection check request to devices
 */
// TODO: add connection check every 5 seconds using node cron
export async function sendCheckConnectionRequest() {
    publishMessage(process.env.MQTT_TOPIC_CHECK_CONNECTION_RESPONSE as string,"ping")
}