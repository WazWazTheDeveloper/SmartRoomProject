import { v4 as uuidv4 } from 'uuid';
import { DeviceDataTypesConfigs } from "../interfaces/deviceData.interface"
import { ERROR_LOG, logEvents } from "../middleware/logger"
import Device from "../models/device"
import { COLLECTION_DEVICES, createDocument, deleteDocuments, getCollection, getDocuments, updateDocument } from "./mongoDBService"
import { createNewMqttTopic } from './mqttTopicService';
import { TDeviceJSON_DB, TDeviceProperty } from '../interfaces/device.interface';
import * as mongoDB from "mongodb";
import { deleteAllProperyChecksOfDevice } from './taskService';

type DeviceResult = {
    isSuccessful: false
} | {
    isSuccessful: true
    device: Device
}

export async function initializeDeviceHandler(handler:(changeEvent:mongoDB.ChangeStreamDocument) => void) {
    let collection : mongoDB.Collection<TDeviceJSON_DB>
    try {
        collection = await getCollection("devices") as mongoDB.Collection<TDeviceJSON_DB>;
    }catch(e) {
        // TODO: maybe add ERROR LOG
        console.log(e)
        return false
    }

    const changeStream = collection.watch()
    changeStream.on("change",handler);

    return true
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
    const isSuccessful = await createDocument(COLLECTION_DEVICES, newDevice.getAsJson_DB())

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

    return functionResult
}

export async function getDevice(_id: string): Promise<DeviceResult> {
    let functionResult: DeviceResult = { isSuccessful: false }

    //query
    const fillter = { _id: _id }
    const findResultArr = await getDocuments<TDeviceJSON_DB>(COLLECTION_DEVICES, fillter)

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
    // TODO: add data validation
    
    //create update obj from propertyList
    const set: any = {}
    for (let index = 0; index < propertyList.length; index++) {
        const property = propertyList[index];
        set[property.propertyName] = property.newValue;
    }

    const updateFilter: mongoDB.UpdateFilter<TDeviceJSON_DB> = {
        $set: set 
    }
    
    const filter = { _id: _id }
    await updateDocument(COLLECTION_DEVICES, filter, updateFilter);
}

export async function deleteDevice(_id: string) {
    await deleteAllProperyChecksOfDevice(_id)

    const filter= {
        _id: _id
    }
    await deleteDocuments("devices",filter);
}