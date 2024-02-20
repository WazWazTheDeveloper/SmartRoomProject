import { v4 as uuidv4 } from "uuid";
import { DeviceDataTypesConfigs } from "../interfaces/deviceData.interface";
import { ERROR_LOG, logEvents } from "../middleware/logger";
import Device from "../models/device";
import {
    COLLECTION_DEVICES,
    JSONDBTypes,
    bulkWriteCollection,
    createDocument,
    deleteDocuments,
    getCollection,
    getDocuments,
    updateDocument,
} from "./mongoDBService";
import { createNewMqttTopic } from "./mqttTopicService";
import {
    TDeviceJSON_DB,
    TDeviceProperty,
} from "../interfaces/device.interface";
import * as mongoDB from "mongodb";
import { deleteAllProperyChecksOfDevice } from "./taskService";

type DeviceResult =
    | {
          isSuccessful: false;
      }
    | {
          isSuccessful: true;
          device: Device;
      };

export async function initializeDeviceHandler(
    handler: (changeEvent: mongoDB.ChangeStreamDocument) => void
) {
    let collection: mongoDB.Collection<TDeviceJSON_DB>;
    try {
        collection = (await getCollection(
            "devices"
        )) as mongoDB.Collection<TDeviceJSON_DB>;
    } catch (e) {
        // TODO: maybe add ERROR LOG
        console.log(e);
        return false;
    }

    const changeStream = collection.watch();
    changeStream.on("change", handler);

    return true;
}

export async function createDevice(
    deviceName: string,
    dataTypeArray: DeviceDataTypesConfigs[]
): Promise<DeviceResult> {
    let functionResult: DeviceResult = { isSuccessful: false };
    let logItem = "";
    const _id = uuidv4();
    const topicPath = `device.${_id}`;

    // create mqtt topic
    const deviceTopicResult = await createNewMqttTopic(_id, topicPath);

    // check if created isSuccessful
    if (!deviceTopicResult.isSuccessful) {
        logItem = `Failed to create device due to failing to create a topic`;
        logEvents(logItem, ERROR_LOG);
        return functionResult;
    }

    //create and add mqtt topics to DeviceDataTypesConfigs
    for (let i = 0; i < dataTypeArray.length; i++) {
        const config = dataTypeArray[i];

        const configTopicResult = await createNewMqttTopic(
            `${_id}.${i}`,
            `${topicPath}.${i}`
        );
        // check if created isSuccessful
        if (!configTopicResult.isSuccessful) {
            logItem = `Failed to create device due to failing to create a topic to data`;
            logEvents(logItem, ERROR_LOG);
            return functionResult;
        }

        config.mqttPrimeryTopicID = configTopicResult.mqttTopicObject._id;
    }

    // create Device and insert into db
    const newDevice = Device.createNewDevice(
        _id,
        deviceName,
        deviceTopicResult.mqttTopicObject._id,
        dataTypeArray
    );
    const isSuccessful = await createDocument(
        COLLECTION_DEVICES,
        newDevice.getAsJson_DB()
    );

    // check if acknowledged by db
    if (isSuccessful) {
        functionResult = {
            isSuccessful: true,
            device: newDevice,
        };
    } else {
        functionResult = {
            isSuccessful: false,
        };
    }

    return functionResult;
}

export async function getDevice(_id: string): Promise<DeviceResult> {
    let functionResult: DeviceResult = { isSuccessful: false };

    //query
    const fillter = { _id: _id };
    const findResultArr = await getDocuments<TDeviceJSON_DB>(
        COLLECTION_DEVICES,
        fillter
    );

    //validation
    if (findResultArr.length > 1) {
        let err = `Multipale documents with _id:${_id} at: deviceCollection`;
        logEvents(err, ERROR_LOG);
        throw new Error(err);
    } else if (findResultArr.length == 0) {
        functionResult = { isSuccessful: false };
    } else {
        const queryDevice = Device.createDeviceFromTDeviceJSON_DB(
            findResultArr[0]
        );
        functionResult = { isSuccessful: true, device: queryDevice };
    }

    return functionResult;
}

type TUpdateDeviceProperties = {
    _id: string;
    propertyToChange: TDeviceProperty;
};
export async function updateDeviceProperties(
    changeList: TUpdateDeviceProperties[]
) {
    // TODO: add data validation

    //create update obj from propertyList
    const set: any = {};
    const operations: mongoDB.AnyBulkWriteOperation<JSONDBTypes>[] = [];
    // move this to sub functions
    for (let index = 0; index < changeList.length; index++) {
        const changeItem = changeList[index];
        if (!changeItem._id) continue;

        if (
            changeItem.propertyToChange.propertyName == "deviceName" ||
            changeItem.propertyToChange.propertyName == "isAccepted" ||
            changeItem.propertyToChange.propertyName == "isAdminOnly" ||
            changeItem.propertyToChange.propertyName == "mqttTopicID"
        ) {
            if (!changeItem.propertyToChange.newValue) continue;

            const filter = { _id: changeItem._id };
            const operation: mongoDB.AnyBulkWriteOperation<JSONDBTypes> = {
                updateOne: {
                    filter: filter,
                    update: {
                        $set: {
                            [changeItem.propertyToChange.propertyName]:
                                changeItem.propertyToChange.newValue,
                        },
                    },
                },
            };
            operations.push(operation);
        } else if (
            changeItem.propertyToChange.typeID == 0 ||
            changeItem.propertyToChange.typeID == 1
        ) {
            if (!changeItem.propertyToChange.dataID) continue;
            if (!changeItem.propertyToChange.newValue) continue;
            if (!changeItem.propertyToChange.dataPropertyName) continue;

            let filter2 = {
                _id: changeItem._id,
                "data.dataID": changeItem.propertyToChange.dataID,
            };
            const operation: mongoDB.AnyBulkWriteOperation<JSONDBTypes> = {
                updateOne: {
                    filter: filter2,
                    update: {
                        $set: {
                            [`data.$.${changeItem.propertyToChange.dataPropertyName}`]:
                                changeItem.propertyToChange.newValue,
                        },
                    },
                },
            };
            operations.push(operation);
        } else if (changeItem.propertyToChange.typeID == 2) {
            if (!changeItem.propertyToChange.dataID) continue;

            let set2 = {};
            let filter2 = {
                _id: changeItem._id,
                "data.dataID": changeItem.propertyToChange.dataID,
            };
            if (
                changeItem.propertyToChange.dataPropertyName == "currentState"
            ) {
                if (!changeItem.propertyToChange.newValue) continue;
                if (!changeItem.propertyToChange.dataPropertyName) continue;

                const operation: mongoDB.AnyBulkWriteOperation<JSONDBTypes> = {
                    updateOne: {
                        filter: filter2,
                        update: {
                            $set: {
                                [`data.$.${changeItem.propertyToChange.dataPropertyName}`]:
                                    changeItem.propertyToChange.newValue,
                            },
                        },
                    },
                };
                operations.push(operation);
            } else {
                if (
                    changeItem.propertyToChange.dataPropertyName == "stateList"
                ) {
                    if (!changeItem.propertyToChange.operation) continue;
                    if (!changeItem.propertyToChange.dataPropertyName) continue;

                    if (changeItem.propertyToChange.operation == "add") {
                        if (!changeItem.propertyToChange.newState) continue;
                        if (!changeItem.propertyToChange.newState.stateValue) continue;
                        if (!changeItem.propertyToChange.newState.icon) continue;
                        if (!changeItem.propertyToChange.newState.isIcon) continue;
                        if (!changeItem.propertyToChange.newState.stateTitle) continue;

                        // need to add a check to see it stateValue exist
                        const operation: mongoDB.AnyBulkWriteOperation<JSONDBTypes> =
                            {
                                updateOne: {
                                    filter: filter2,
                                    update: {
                                        $push: {
                                            "data.$.stateList":
                                                changeItem.propertyToChange
                                                    .newState,
                                        },
                                    },
                                },
                            };
                        operations.push(operation);
                    }
                    if (changeItem.propertyToChange.operation == "delete") {
                        if (!changeItem.propertyToChange.stateValue) continue;

                        const operation: mongoDB.AnyBulkWriteOperation<JSONDBTypes> =
                            {
                                updateOne: {
                                    filter: filter2,
                                    update: {
                                        $pull: {
                                            "data.$.stateList": {
                                                stateValue:
                                                    changeItem.propertyToChange
                                                        .stateValue,
                                            },
                                        },
                                    },
                                },
                            };
                        operations.push(operation);
                    }
                    if (changeItem.propertyToChange.operation == "update") {
                        if (!changeItem.propertyToChange.state) continue;
                        if (!changeItem.propertyToChange.state.stateValue) continue;

                        let filter2 = {
                            _id: changeItem._id,
                            "data.dataID": changeItem.propertyToChange.dataID,
                        };
                        const set: any = {};
                        if (changeItem.propertyToChange.state.isIcon)
                            set[`data.$.stateList.$[e].isIcon`] =
                                changeItem.propertyToChange.state.isIcon;
                        if (changeItem.propertyToChange.state.icon)
                            set[`data.$.stateList.$[e].icon`] =
                                changeItem.propertyToChange.state.icon;
                        if (changeItem.propertyToChange.state.stateTitle)
                            set[`data.$.stateList.$[e].stateTitle`] =
                                changeItem.propertyToChange.state.stateTitle;
                        const operation: mongoDB.AnyBulkWriteOperation<JSONDBTypes> =
                            {
                                updateOne: {
                                    filter: filter2,
                                    update: {
                                        $set: set,
                                    },
                                    arrayFilters: [
                                        {
                                            "e.stateValue":
                                                changeItem.propertyToChange
                                                    .state.stateValue,
                                        },
                                    ],
                                },
                            };
                        operations.push(operation);
                    }
                }
            }
        }
    }

    const updateFilter: mongoDB.UpdateFilter<TDeviceJSON_DB> = {
        $set: set,
    };

    await bulkWriteCollection(COLLECTION_DEVICES, operations);
}

export async function deleteDevice(_id: string) {
    await deleteAllProperyChecksOfDevice(_id);

    const filter = {
        _id: _id,
    };
    await deleteDocuments("devices", filter);
}
