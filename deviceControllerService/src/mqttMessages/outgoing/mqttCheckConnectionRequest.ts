import { publishMessage } from "../../services/mqttClientService";

/***
 * @description send connection check request to devices
 */
export async function sendCheckConnectionRequest() {
    publishMessage(process.env.MQTT_TOPIC_CHECK_CONNECTION_REQUEST as string,"ping")
}