import { v4 as uuidv4 } from 'uuid';
import { DeviceDataTypesConfigs } from "../interfaces/deviceData.interface"
import { DB_LOG, ERROR_LOG, logEvents } from "../middleware/logger"
import Device from "../models/device"
import { collections } from "./mongoDBService"
import mqttTopicObject from '../models/mqttTopicObject';
import { createNewMqttTopic } from './mqttTopicService';

type createDeviceResult = {
    isSuccessful: false
} | {
    isSuccessful: true
    device: Device
}

export async function createDevice(dataTypeArray: DeviceDataTypesConfigs[]): Promise<createDeviceResult> {
    let functionResult: createDeviceResult = { isSuccessful: false }
    let logItem = "";

    const deviceCollection = collections.devices
    if (!deviceCollection) {
        const err = "no collection found devices at deviceService.ts line:8"
        logEvents(err, ERROR_LOG)
        throw new Error(err)
    }

    const _id = uuidv4()
    const topicPath = `device.${_id}`
    const deviceTopicResult = await createNewMqttTopic(_id, topicPath)

    if (!deviceTopicResult.isSuccessful) {
        logItem = `Failed to create device due to failing to create a topic`
        logEvents(logItem, DB_LOG)
        return functionResult
    }

    const newDevice = new Device(_id, deviceTopicResult.mqttTopicObject._id, dataTypeArray)

    const insertResult = await deviceCollection?.insertOne(newDevice.getAsJson_DB());
    if (insertResult.acknowledged) {
        logItem = `A document type "Device" was inserted with the _id: ${insertResult.insertedId} to ${deviceCollection.namespace}`
        functionResult = {
            isSuccessful: true,
            device: newDevice,
        }
    }
    else {
        logItem = `Failed to insert document of type "Device" with the _id: ${insertResult.insertedId} to ${deviceCollection.namespace}\t
        ${JSON.stringify(newDevice.getAsJson(), null, "\t")}`
        functionResult = {
            isSuccessful: false,
        }
    }

    logEvents(logItem, DB_LOG)
    return functionResult
}