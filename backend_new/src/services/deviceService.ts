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
    getDocumentsAggregate,
} from "./mongoDBService";
import { createNewMqttTopic } from "./mqttTopicService";
import {
    TDeviceJSON_DB,
    TDeviceProperty,
} from "../interfaces/device.interface";
import * as mongoDB from "mongodb";
import { deleteAllProperyChecksOfDevice } from "./taskService";
import SwitchData from "../models/dataTypes/switchData";
import NumberData from "../models/dataTypes/numberData";
import MultiStateButton from "../models/dataTypes/multiStateButtonData";

type DeviceResult =
    | {
        isSuccessful: false;
    }
    | {
        isSuccessful: true;
        device: Device;
    };

export async function initializeDeviceHandler(handler: (changeEvent: mongoDB.ChangeStreamDocument) => void) {
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

export async function createDevice(deviceName: string, dataTypeArray: DeviceDataTypesConfigs[]): Promise<DeviceResult> {
    let functionResult: DeviceResult = { isSuccessful: false };
    let logItem = "";
    const _id = uuidv4();
    const topicPath = `device/${_id}`;

    // create mqtt topic
    const deviceTopicResult = await createNewMqttTopic(_id, topicPath, -1);
    const deviceTopicResulta = await createNewMqttTopic(_id+"a", topicPath, -1);

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
            `${_id}/${i}`,
            `${topicPath}/${i}`,
            config.typeID
        );
        // check if created isSuccessful
        if (!configTopicResult.isSuccessful) {
            logItem = `Failed to create device due to failing to create a topic to data`;
            logEvents(logItem, ERROR_LOG);
            return functionResult;
        }

        config.mqttTopicID = configTopicResult.mqttTopicObject._id;
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

export type TUpdateDeviceProperties = {
    _id: string;
    propertyToChange: TDeviceProperty;
};
type TUpdateDeviceReturn = {
    isSuccessful: boolean;
    error: string;
};

// TODO: add stuff from TDeviceDataProperty
export async function updateDeviceProperties(changeList: TUpdateDeviceProperties[]): Promise<TUpdateDeviceReturn> {
    function returnError(error: string): TUpdateDeviceReturn {
        returnObj.error = error;
        return returnObj;
    }

    const operations: mongoDB.AnyBulkWriteOperation<JSONDBTypes>[] = [];
    const returnObj: TUpdateDeviceReturn = {
        isSuccessful: false,
        error: "",
    };
    //checks
    if (!changeList) return returnError("changeList is undefined");
    if (!Array.isArray(changeList))
        return returnError("changeList is not an array");

    for (let index = 0; index < changeList.length; index++) {
        const changeItem = changeList[index];

        //checks
        if (!changeItem)
            return returnError(`changeList[${index}].changeItem is undefined`);
        if (!changeItem._id)
            return returnError(`changeList[${index}]._id is undefined`);
        if (!changeItem.propertyToChange)
            return returnError(
                `changeList[${index}].propertyToChange is undefined`
            );
        if (typeof changeItem.propertyToChange.propertyName != "string")
            return returnError(
                `changeList[${index}].propertyName is not a string`
            );

        const propertyName = changeItem.propertyToChange.propertyName;
        if (propertyName == "deviceName") {
            //type checking
            if (typeof changeItem.propertyToChange.newValue != "string")
                return returnError(
                    `changeList[${index}].propertyToChange.newValue is not a string`
                );

            const filter = { _id: changeItem._id };
            const operation: mongoDB.AnyBulkWriteOperation<JSONDBTypes> = {
                updateOne: {
                    filter: filter,
                    update: {
                        $set: {
                            [propertyName]:
                                changeItem.propertyToChange.newValue,
                        },
                    },
                },
            };
            operations.push(operation);
        } else if (propertyName == "mqttTopicID") {
            //type checking
            if (typeof changeItem.propertyToChange.newValue != "string")
                return returnError(
                    `changeList[${index}].propertyToChange.newValue is not a string`
                );

            const filter = { _id: changeItem._id };
            const operation: mongoDB.AnyBulkWriteOperation<JSONDBTypes> = {
                updateOne: {
                    filter: filter,
                    update: [{
                        $set: {
                            previousTopicID : "$mqttTopicID",
                            [propertyName]:changeItem.propertyToChange.newValue,
                        },
                    }]
                },
            };
            operations.push(operation);
        } else if (propertyName == "isAccepted") {
            //type checking
            if (typeof changeItem.propertyToChange.newValue != "number")
                return returnError(
                    `changeList[${index}].propertyToChange.newValue is not a number`
                );

            const filter = { _id: changeItem._id };
            const operation: mongoDB.AnyBulkWriteOperation<JSONDBTypes> = {
                updateOne: {
                    filter: filter,
                    update: {
                        $set: {
                            [propertyName]:
                                changeItem.propertyToChange.newValue,
                        },
                    },
                },
            };
            operations.push(operation);
        } else if (propertyName == "isAdminOnly") {
            //type checking
            if (typeof changeItem.propertyToChange.newValue != "boolean")
                return returnError(
                    `changeList[${index}].propertyToChange.newValue is not a boolean`
                );

            const filter = { _id: changeItem._id };
            const operation: mongoDB.AnyBulkWriteOperation<JSONDBTypes> = {
                updateOne: {
                    filter: filter,
                    update: {
                        $set: {
                            [propertyName]:
                                changeItem.propertyToChange.newValue,
                        },
                    },
                },
            };
            operations.push(operation);
        } else if (propertyName == "isConnected") {
            //type checking
            if (typeof changeItem.propertyToChange.newValue != "boolean")
                return returnError(
                    `changeList[${index}].propertyToChange.dataID is not a boolean`
                );

            const filter = { _id: changeItem._id };
            const operation: mongoDB.AnyBulkWriteOperation<JSONDBTypes> = {
                updateOne: {
                    filter: filter,
                    update: {
                        $set: {
                            [propertyName]:
                                changeItem.propertyToChange.newValue,
                        },
                    },
                },
            };
            operations.push(operation);
        } else if (propertyName == "isConnectedCheck") {
            //type checking
            if (typeof changeItem.propertyToChange.newValue != "boolean")
                return returnError(
                    `changeList[${index}].propertyToChange.dataID is not a boolean`
                );

            const filter = { _id: changeItem._id };
            const operation: mongoDB.AnyBulkWriteOperation<JSONDBTypes> = {
                updateOne: {
                    filter: filter,
                    update: {
                        $set: {
                            [propertyName]:
                                changeItem.propertyToChange.newValue,
                        },
                    },
                },
            };
            operations.push(operation);
        } else if (propertyName == "data") {
            //type checking
            if (typeof changeItem.propertyToChange.dataID != "number")
                return returnError(
                    `changeList[${index}].propertyToChange.dataID is not a number`
                );
            if (typeof changeItem.propertyToChange.typeID != "number")
                return returnError(
                    `changeList[${index}].propertyToChange.typeID is not a number`
                );
            if (!changeItem.propertyToChange.dataPropertyName)
                return returnError(
                    `changeList[${index}].propertyToChange.dataPropertyName is undefined`
                );
            if (typeof changeItem.propertyToChange.dataPropertyName != "string")
                return returnError(
                    `changeList[${index}].propertyToChange.dataPropertyName is not a string`
                );

            const dataPropertyName =
                changeItem.propertyToChange.dataPropertyName;
            const typeID = changeItem.propertyToChange.typeID;

            if (
                dataPropertyName == "mqttTopicID" ||
                dataPropertyName == "iconName" ||
                dataPropertyName == "dataTitle"
            ) {
                if (typeof changeItem.propertyToChange.newValue != "string")
                    return returnError(
                        `changeList[${index}].propertyToChange.newValue is not a string`
                    );

                const filter = {
                    _id: changeItem._id,
                    "data.dataID": changeItem.propertyToChange.dataID,
                };
                const operation: mongoDB.AnyBulkWriteOperation<JSONDBTypes> = {
                    updateOne: {
                        filter: filter,
                        update: {
                            $set: {
                                [`data.$.${dataPropertyName}`]:
                                    changeItem.propertyToChange.newValue,
                            },
                        },
                    },
                };
                operations.push(operation);
            } else if (dataPropertyName == "isSensor") {
                //type checking
                if (typeof changeItem.propertyToChange.newValue != "boolean")
                    return returnError(
                        `changeList[${index}].propertyToChange.newValue is not a boolean`
                    );

                const filter = {
                    _id: changeItem._id,
                    "data.dataID": changeItem.propertyToChange.dataID,
                };
                const operation: mongoDB.AnyBulkWriteOperation<JSONDBTypes> = {
                    updateOne: {
                        filter: filter,
                        update: {
                            $set: {
                                [`data.$.${dataPropertyName}`]:
                                    changeItem.propertyToChange.newValue,
                            },
                        },
                    },
                };
                operations.push(operation);
            }
            // else if (dataPropertyName == "mqttSecondaryTopicID") {
            //     //type checking
            //     if (typeof changeItem.propertyToChange.newValue != "string") return returnError(`changeList[${index}].propertyToChange.newValue is not a string`)

            //     if (changeItem.propertyToChange.operation == "add") {
            //         const filter = {
            //             _id: changeItem._id,
            //             "data.dataID": changeItem.propertyToChange.dataID,
            //         };
            //         const operation: mongoDB.AnyBulkWriteOperation<JSONDBTypes> =
            //         {
            //             updateOne: {
            //                 filter: filter,
            //                 update: {
            //                     $push: {
            //                         "data.$.mqttSecondaryTopicID": changeItem.propertyToChange.newValue,
            //                     },
            //                 },
            //             },
            //         };
            //         operations.push(operation);
            //     }
            //     else if (changeItem.propertyToChange.operation == "delete") {
            //         const filter = {
            //             _id: changeItem._id,
            //             "data.dataID": changeItem.propertyToChange.dataID,
            //         };
            //         const operation: mongoDB.AnyBulkWriteOperation<JSONDBTypes> =
            //         {
            //             updateOne: {
            //                 filter: filter,
            //                 update: {
            //                     $pull: {
            //                         "data.$.mqttSecondaryTopicID":  changeItem.propertyToChange.newValue,
            //                     },
            //                 },
            //             },
            //         };
            //         operations.push(operation);
            //     } else return returnError(`changeList[${index}].propertyToChange.operation is not a valid option`)
            // }
            else if (typeID == SwitchData.TYPE_ID) {
                //type checking
                if (!changeItem.propertyToChange.newValue)
                    return returnError(
                        `changeList[${index}].propertyToChange.newValue is undefined`
                    );
                if (dataPropertyName == "isOn") {
                    if (
                        typeof changeItem.propertyToChange.newValue != "boolean"
                    )
                        return returnError(
                            `changeList[${index}].propertyToChange.newValue is not a boolean`
                        );
                } else if (
                    dataPropertyName == "onName" ||
                    dataPropertyName == "offName"
                ) {
                    if (typeof changeItem.propertyToChange.newValue != "string")
                        return returnError(
                            `changeList[${index}].propertyToChange.newValue is not a string`
                        );
                } else
                    return returnError(
                        `changeList[${index}].propertyToChange.dataPropertyName is not a valid option`
                    );

                const filter = {
                    _id: changeItem._id,
                    "data.dataID": changeItem.propertyToChange.dataID,
                };
                const operation: mongoDB.AnyBulkWriteOperation<JSONDBTypes> = {
                    updateOne: {
                        filter: filter,
                        update: {
                            $set: {
                                [`data.$.${dataPropertyName}`]:
                                    changeItem.propertyToChange.newValue,
                            },
                        },
                    },
                };
                operations.push(operation);
            } else if (typeID == NumberData.TYPE_ID) {
                //type checking
                if (!changeItem.propertyToChange.newValue)
                    return returnError(
                        `changeList[${index}].propertyToChange.newValue is undefined`
                    );
                if (
                    dataPropertyName == "currentValue" ||
                    dataPropertyName == "minValue" ||
                    dataPropertyName == "maxValue" ||
                    dataPropertyName == "jumpValue"
                ) {
                    if (typeof changeItem.propertyToChange.newValue != "number")
                        return returnError(
                            `changeList[${index}].propertyToChange.newValue is not a number`
                        );
                } else if (dataPropertyName == "symbol") {
                    if (typeof changeItem.propertyToChange.newValue != "string")
                        return returnError(
                            `changeList[${index}].propertyToChange.newValue is not a string`
                        );
                } else
                    return returnError(
                        `changeList[${index}].propertyToChange.dataPropertyName is not a valid option`
                    );

                const filter = {
                    _id: changeItem._id,
                    "data.dataID": changeItem.propertyToChange.dataID,
                };
                const operation: mongoDB.AnyBulkWriteOperation<JSONDBTypes> = {
                    updateOne: {
                        filter: filter,
                        update: {
                            $set: {
                                [`data.$.${dataPropertyName}`]:
                                    changeItem.propertyToChange.newValue,
                            },
                        },
                    },
                };
                operations.push(operation);
            } else if (typeID == MultiStateButton.TYPE_ID) {
                const filter = {
                    _id: changeItem._id,
                    "data.dataID": changeItem.propertyToChange.dataID,
                };

                if (dataPropertyName == "currentState") {
                    //type checking
                    if (typeof changeItem.propertyToChange.newValue != "number")
                        return returnError(
                            `changeList[${index}].propertyToChange.newValue is not a number`
                        );

                    const operation: mongoDB.AnyBulkWriteOperation<JSONDBTypes> =
                    {
                        updateOne: {
                            filter: filter,
                            update: {
                                $set: {
                                    [`data.$.${dataPropertyName}`]:
                                        changeItem.propertyToChange
                                            .newValue,
                                },
                            },
                        },
                    };
                    operations.push(operation);
                } else if (
                    changeItem.propertyToChange.dataPropertyName == "stateList"
                ) {
                    if (changeItem.propertyToChange.operation == "add") {
                        //type checking
                        if (!changeItem.propertyToChange.newState)
                            return returnError(
                                `changeList[${index}].propertyToChange.newState is undefined`
                            );
                        if (
                            typeof changeItem.propertyToChange.newState.icon !=
                            "string"
                        )
                            return returnError(
                                `changeList[${index}].propertyToChange.newState.icon is not a string`
                            );
                        if (
                            typeof changeItem.propertyToChange.newState
                                .isIcon != "boolean"
                        )
                            return returnError(
                                `changeList[${index}].propertyToChange.newState.isIcon is not a boolean`
                            );
                        if (
                            typeof changeItem.propertyToChange.newState
                                .stateTitle != "string"
                        )
                            return returnError(
                                `changeList[${index}].propertyToChange.newState.stateTitle is not a string`
                            );
                        if (
                            typeof changeItem.propertyToChange.newState
                                .stateValue != "number"
                        )
                            return returnError(
                                `changeList[${index}].propertyToChange.newState.stateValue is not a number`
                            );

                        const operation: mongoDB.AnyBulkWriteOperation<JSONDBTypes> =
                        {
                            updateOne: {
                                filter: filter,
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
                    } else if (
                        changeItem.propertyToChange.operation == "delete"
                    ) {
                        //type checking
                        if (
                            typeof changeItem.propertyToChange.stateValue !=
                            "number"
                        )
                            return returnError(
                                `changeList[${index}].propertyToChange.stateValue is not a number`
                            );

                        const operation: mongoDB.AnyBulkWriteOperation<JSONDBTypes> =
                        {
                            updateOne: {
                                filter: filter,
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
                    } else if (
                        changeItem.propertyToChange.operation == "update"
                    ) {
                        //type checking
                        if (!changeItem.propertyToChange.state)
                            return returnError(
                                `changeList[${index}].propertyToChange.state is undefined`
                            );
                        if (
                            typeof changeItem.propertyToChange.state
                                .stateValue != "number"
                        )
                            return returnError(
                                `changeList[${index}].propertyToChange.state.stateValue is not a number`
                            );
                        if (
                            typeof changeItem.propertyToChange.state.isIcon !=
                            "boolean"
                        )
                            return returnError(
                                `changeList[${index}].propertyToChange.state.isIcon is not a boolean`
                            );
                        if (
                            typeof changeItem.propertyToChange.state
                                .stateTitle != "string"
                        )
                            return returnError(
                                `changeList[${index}].propertyToChange.state.stateTitle is not a string`
                            );
                        if (
                            typeof changeItem.propertyToChange.state.icon !=
                            "string"
                        )
                            return returnError(
                                `changeList[${index}].propertyToChange.state.icon is not a string`
                            );

                        const set: any = {};
                        if (
                            typeof changeItem.propertyToChange.state.isIcon ==
                            "boolean"
                        )
                            set[`data.$[dataID].stateList.$[e].isIcon`] =
                                changeItem.propertyToChange.state.isIcon;
                        if (
                            typeof changeItem.propertyToChange.state.icon ==
                            "string"
                        )
                            set[`data.$[dataID].stateList.$[e].icon`] =
                                changeItem.propertyToChange.state.icon;
                        if (
                            typeof changeItem.propertyToChange.state
                                .stateTitle == "string"
                        )
                            set[`data.$[dataID].stateList.$[e].stateTitle`] =
                                changeItem.propertyToChange.state.stateTitle;

                        const operation: mongoDB.AnyBulkWriteOperation<JSONDBTypes> =
                        {
                            updateOne: {
                                filter: filter,
                                update: {
                                    $set: set,
                                },
                                arrayFilters: [
                                    {
                                        "e.stateValue":
                                            changeItem.propertyToChange
                                                .state.stateValue,
                                    },
                                    {
                                        "dataID.dataID":
                                            changeItem.propertyToChange
                                                .dataID,
                                    },
                                ],
                            },
                        };
                        operations.push(operation);
                    } else
                        return returnError(
                            `changeList[${index}].propertyToChange.operation is not a valid option`
                        );
                } else
                    return returnError(
                        `changeList[${index}].propertyToChange.dataPropertyName is not a valid option`
                    );
            }
        }
    }

    await bulkWriteCollection(COLLECTION_DEVICES, operations);
    returnObj.isSuccessful = true;
    return returnObj;
}

export async function deleteDevice(_id: string) {
    await deleteAllProperyChecksOfDevice(_id);

    const filter = {
        _id: _id,
    };
    await deleteDocuments("devices", filter);
}

export async function aggregateDevices(aggregateArray: any[]) {
    let queryResult = await getDocumentsAggregate<TDeviceJSON_DB>(
        COLLECTION_DEVICES,
        aggregateArray
    );
    return queryResult;
}
