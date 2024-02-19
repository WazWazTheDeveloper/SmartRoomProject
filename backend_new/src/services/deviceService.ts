import { v4 as uuidv4 } from 'uuid';
import { DeviceDataTypesConfigs } from "../interfaces/deviceData.interface"
import { ERROR_LOG, logEvents } from "../middleware/logger"
import Device from "../models/device"
import { COLLECTION_DEVICES, JSONDBTypes, bulkWriteCollection, createDocument, deleteDocuments, getCollection, getDocuments, updateDocument } from "./mongoDBService"
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

export async function initializeDeviceHandler(handler: (changeEvent: mongoDB.ChangeStreamDocument) => void) {
    let collection: mongoDB.Collection<TDeviceJSON_DB>
    try {
        collection = await getCollection("devices") as mongoDB.Collection<TDeviceJSON_DB>;
    } catch (e) {
        // TODO: maybe add ERROR LOG
        console.log(e)
        return false
    }

    const changeStream = collection.watch()
    changeStream.on("change", handler);

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

    //create and add mqtt topics to DeviceDataTypesConfigs
    for (let i = 0; i < dataTypeArray.length; i++) {
        const config = dataTypeArray[i];

        const configTopicResult = await createNewMqttTopic(`${_id}.${i}`, `${topicPath}.${i}`)
        // check if created isSuccessful
        if (!configTopicResult.isSuccessful) {
            logItem = `Failed to create device due to failing to create a topic to data`
            logEvents(logItem, ERROR_LOG)
            return functionResult
        }

        config.mqttPrimeryTopicID = configTopicResult.mqttTopicObject._id
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


    const filter = { _id: _id }
    //create update obj from propertyList
    const set: any = {}
    const operations: mongoDB.AnyBulkWriteOperation<JSONDBTypes>[] = []
    // move this to sub functions
    for (let index = 0; index < propertyList.length; index++) {
        const property = propertyList[index];
        if (
            property.propertyName == "deviceName" ||
            property.propertyName == "isAccepted" ||
            property.propertyName == "isAdminOnly" ||
            property.propertyName == "mqttTopicID"
        ) {
            set[property.propertyName] = property.newValue;
        } else if (property.typeID == 0 || property.typeID == 1) {
            let filter2 = {
                _id: _id,
                'data.dataID': property.dataID
            }
            const operation: mongoDB.AnyBulkWriteOperation<JSONDBTypes> = {
                updateOne: {
                    filter: filter2,
                    update: {
                        $set: {
                            [`data.$.${property.dataPropertyName}`]: property.newValue
                        }
                    }
                }
            }
            operations.push(operation);
        } else if (property.typeID == 2) {
            let set2 = {}
            let filter2 = {
                _id: _id,
                'data.dataID': property.dataID
            }
            if (property.dataPropertyName == "currentState") {
                const operation: mongoDB.AnyBulkWriteOperation<JSONDBTypes> = {
                    updateOne: {
                        filter: filter2,
                        update: {
                            $set: {
                                [`data.$.${property.dataPropertyName}`]: property.newValue
                            }
                        }
                    }
                }
                operations.push(operation);
            } else {
                if (property.dataPropertyName == "stateList") {
                    if (property.operation == "add") {
                        // need to add a check to see it stateValue exist
                        const operation: mongoDB.AnyBulkWriteOperation<JSONDBTypes> = {
                            updateOne: {
                                filter: filter2,
                                update: {
                                    $push: {
                                        'data.$.stateList': property.newState
                                    }
                                }
                            }
                        }
                        operations.push(operation);
                    }
                    if (property.operation == "delete") {
                        const operation: mongoDB.AnyBulkWriteOperation<JSONDBTypes> = {
                            updateOne: {
                                filter: filter2,
                                update: {
                                    $pull: {
                                        'data.$.stateList': { stateValue: property.stateValue }
                                    }
                                }
                            }
                        }
                        operations.push(operation);
                    }
                    if (property.operation == "update") {
                        let filter2 = {
                            _id: _id,
                            'data.dataID': property.dataID,
                        }
                        const set: any = {}
                        if (property.state.isIcon) set[`data.$.stateList.$[e].isIcon`] = property.state.isIcon
                        if (property.state.icon) set[`data.$.stateList.$[e].icon`] = property.state.icon
                        if (property.state.stateTitle) set[`data.$.stateList.$[e].stateTitle`] = property.state.stateTitle
                        const operation: mongoDB.AnyBulkWriteOperation<JSONDBTypes> = {
                            updateOne: {
                                filter: filter2,
                                update: {
                                    $set: set
                                },
                                arrayFilters: [{ "e.stateValue": property.state.stateValue }]
                            }
                        }
                        operations.push(operation);
                    }
                }
            }
        }
    }

    const updateFilter: mongoDB.UpdateFilter<TDeviceJSON_DB> = {
        $set: set
    }

    await bulkWriteCollection(COLLECTION_DEVICES, operations);
}

export async function deleteDevice(_id: string) {
    await deleteAllProperyChecksOfDevice(_id)

    const filter = {
        _id: _id
    }
    await deleteDocuments("devices", filter);
}