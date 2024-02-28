import { TDeviceDataObject } from "../../interfaces/device.interface";
import { TDeviceDataDeviceProperties } from "../../interfaces/deviceData.interface";
import { TGetDeviceRequest, TGetDeviceResponse } from "../../interfaces/mqttMassge.interface";
import MultiStateButton from "../../models/dataTypes/multiStateButtonData";
import NumberData from "../../models/dataTypes/numberData";
import SwitchData from "../../models/dataTypes/switchData";
import * as DeviceService from "../../services/deviceService";
import { publishMessage } from "../../services/mqttClientService";

/**
 * @description handles device powerup requests to recived data via mqtt server
 * @param topic mqtt topic that published the message
 * @param message message send via mqtt
 * @returns void
 */
export async function getDevice(topic: string, message: TGetDeviceRequest) {
    // TODO: add device data as well when requesting data
    if (typeof topic != "string") return;
    if (!message) return;
    if (message.operation != "getDevice") return;
    if (typeof message.deviceID != "string") return;
    if (typeof message.origin != "string") return;

    const result = await DeviceService.getDevice(message.deviceID);
    if (result.isSuccessful) {
        //get all topics from device
        const dataArr: TDeviceDataDeviceProperties[] = [];
        for (let i = 0; i < result.device.data.length; i++) {
            const data = result.device.data[i];
            dataArr.push({
                mqttPrimeryTopicID: data.mqttPrimeryTopicID,
                // mqttSecondaryTopicID: data.mqttSecondaryTopicID,
                dataID: data.dataID,
                typeID : data.typeID,
                value: getData(data)
            });
        }
        const response: TGetDeviceResponse = {
            origin: "server",
            isSuccessful: true,
            deviceID: message.deviceID,
            operation: "getDevice",
            mqttPrimeryTopicID: result.device.mqttTopicID,
            data: dataArr,
        };
        publishMessage(topic, response);
    } else {
        const response: TGetDeviceResponse = {
            origin: "server",
            isSuccessful: false,
            deviceID: message.deviceID,
            operation: "getDevice",
        };
        publishMessage(topic, response);
    }
}


function getData(deviceData : TDeviceDataObject) {
    switch (deviceData.typeID) {
        case(SwitchData.TYPE_ID) :
            return deviceData.isOn
        case(NumberData.TYPE_ID) : 
            return deviceData.currentValue
        case(MultiStateButton.TYPE_ID) : 
            return deviceData.currentState
    }
}