import { v4 as uuidv4 } from 'uuid';
import { DeviceDataTypesConfigs } from "../interfaces/deviceData.interface"
import { DB_LOG, ERROR_LOG, logEvents } from "../middleware/logger"
import Device from "../models/device"
import { collections } from "./mongoDBService"
import mqttTopicObject from '../models/mqttTopicObject';
import { createNewMqttTopic } from './mqttTopicService';
import { TDeviceProperty } from '../interfaces/device.interface';
import { error, log } from 'console';

type createDeviceResult = {
    isSuccessful: false
} | {
    isSuccessful: true
    device: Device
}

export async function createDevice(deviceName: string, dataTypeArray: DeviceDataTypesConfigs[]): Promise<createDeviceResult> {
    let functionResult: createDeviceResult = { isSuccessful: false }
    let logItem = "";
    const _id = uuidv4()
    const topicPath = `device.${_id}`

    // check if db collection exist
    const deviceCollection = collections.devices
    if (!deviceCollection) {
        const err = "no collection found devices at deviceService.ts atcreateDevice"
        logEvents(err, ERROR_LOG)
        throw new Error(err)
    }

    // create mqtt topic
    const deviceTopicResult = await createNewMqttTopic(_id, topicPath)

    // check if created isSuccessful
    if (!deviceTopicResult.isSuccessful) {
        logItem = `Failed to create device due to failing to create a topic`
        logEvents(logItem, DB_LOG)
        return functionResult
    }

    // create Device and insert into db
    const newDevice = Device.createNewDevice(_id, deviceName, deviceTopicResult.mqttTopicObject._id, dataTypeArray)
    const insertResult = await deviceCollection.insertOne(newDevice.getAsJson_DB());

    // check if acknowledged by db
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

export async function getDevice(_id: string): Promise<createDeviceResult> {
    let functionResult: createDeviceResult = { isSuccessful: false }
    let logItem = "";

    // check if db collection exist
    const deviceCollection = collections.devices
    if (!deviceCollection) {
        const err = "no collection found devices at deviceService.ts at getDevice()"
        logEvents(err, ERROR_LOG)
        throw new Error(err)
    }

    //query
    const fillter = { _id: _id }
    const findResult = deviceCollection.find(fillter)
    const findResultArr = await findResult.toArray();

    // log
    logItem = `Search with fillter:${JSON.stringify(fillter)} returned ${findResultArr.length} documents`;
    logEvents(logItem, DB_LOG)

    //validation
    if (findResultArr.length > 1) {
        let err = `Multipale documents with _id:${_id} in:${deviceCollection.namespace}`
        logEvents(err, DB_LOG)
        throw new Error(err)
    }
    else if (findResultArr.length == 0) {
        functionResult = { isSuccessful: false }
    }
    else {
        const queryDevice = Device.createDeviceFromTDeviceJSON_DB(findResultArr[0])
        functionResult = { isSuccessful: true, device: queryDevice }
    }


    return functionResult
}

export async function updateDeviceProperties(_id: string, propertyList: TDeviceProperty[]) {
    let logItem = "";

    // check if db collection exist
    const deviceCollection = collections.devices
    if (!deviceCollection) {
        const err = "no collection found devices at deviceService.ts at updateDeviceProperties"
        logEvents(err, ERROR_LOG)
        throw new Error(err)
    }

    //create update obj from propertyList
    const updateObj: any = {}
    for (let index = 0; index < propertyList.length; index++) {
        const property = propertyList[index];
        updateObj[property.propertyName] = property.newValue;
    }

    // db update
    const updateResult = await deviceCollection.updateOne({ _id: _id }, { $set: updateObj })
    console.log(updateResult)

    //check if accepted by db and return
    if (updateResult.acknowledged) {
        logItem = `Modified ${updateResult.modifiedCount} documents`
        logEvents(logItem, DB_LOG)
        return true
    }
    else {
        logItem = `Failed to update document with _id:${_id} to ${deviceCollection.namespace}\t
        ${JSON.stringify(updateObj, null, "\t")}`
        logEvents(logItem, DB_LOG)
        return false
    }
}