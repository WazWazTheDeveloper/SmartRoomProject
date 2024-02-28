import { publishMessage } from "../../services/mqttClientService";

export async function sendCheckConnectionRequest() {
    publishMessage(process.env.MQTT_TOPIC_CHECK_CONNECTION_RESPONSE as string,"ping")
}