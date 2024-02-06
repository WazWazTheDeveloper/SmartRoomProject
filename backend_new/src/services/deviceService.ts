import { v4 as uuidv4 } from 'uuid';
import { DeviceDataTypesConfigs } from "../interfaces/deviceData.interface"
import { DB_LOG, ERROR_LOG, logEvents } from "../middleware/logger"
import Device from "../models/device"
import { COLLECTION_DEVICES, collections, createDocument, getDocument, updateDocument } from "./mongoDBService"
import { createNewMqttTopic } from './mqttTopicService';
import { TDeviceJSON_DB, TDeviceProperty } from '../interfaces/device.interface';
import { UpdateFilter } from 'mongodb';

type DeviceResult = {
    isSuccessful: false
} | {
    isSuccessful: true
    device: Device
}

export async function createDevice(deviceName: string, dataTypeArray: DeviceDataTypesConfigs[]): Promise<DeviceResult> {
    let functionResult: DeviceResult = { isSuccessful: false }
    let logItem = "";
    const _id = uuidv4()
    const topicPath = `device.${_id}`

    // create mqtt topic
    const deviceTopicResult = await createNewMqttTopic(_id, topicPath)

    // check if created isSuccessful
    if (!deviceTopicResult.isSuccessful) {
        logItem = `Failed to create device due to failing to create a topic`
        logEvents(logItem, ERROR_LOG)
        return functionResult
    }

    // create Device and insert into db
    const newDevice = Device.createNewDevice(_id, deviceName, deviceTopicResult.mqttTopicObject._id, dataTypeArray)
    const isSuccessful = await createDocument(COLLECTION_DEVICES,newDevice.getAsJson_DB())

    // check if acknowledged by db
    if (isSuccessful) {
        functionResult = {
            isSuccessful: true,
            device: newDevice,
        }
    }
    else {
        functionResult = {
            isSuccessful: false,
        }
    }

    logEvents(logItem, DB_LOG)
    return functionResult
}

export async function getDevice(_id: string): Promise<DeviceResult> {
    let functionResult: DeviceResult = { isSuccessful: false }

    //query
    const fillter = { _id: _id }
    const findResultArr= await getDocument<TDeviceJSON_DB>(COLLECTION_DEVICES,fillter)
    // const findResultArr = await findResult.toArray();

    //validation
    if (findResultArr.length > 1) {
        let err = `Multipale documents with _id:${_id} at: deviceCollection`
        logEvents(err, ERROR_LOG)
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
    const deviceCollection = collections.devices

    //create update obj from propertyList
    const set:any = {}
    for (let index = 0; index < propertyList.length; index++) {
        const property = propertyList[index];
        set[property.propertyName] = property.newValue;
    }
    
    const updateFilter: UpdateFilter<TDeviceJSON_DB> = {
        $set: {set}
    }
    
    await updateDocument(COLLECTION_DEVICES,_id,updateFilter);
}