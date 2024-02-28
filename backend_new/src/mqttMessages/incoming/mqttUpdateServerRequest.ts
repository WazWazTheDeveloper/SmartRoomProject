import { TUpdateDataFromDeviceRequest } from "../../interfaces/mqttMassge.interface";
import * as DeviceService from "../../services/deviceService";

/**
 * @description handles device requests to update the state of device on the server
 * @param topic mqtt topic that published the message
 * @param message message send via mqtt
 * @returns void
 */
export async function updateServer(
    topic: string,
    message: TUpdateDataFromDeviceRequest
) {

    let aggregates = [
        {
          $match: {
            path: {
              $in: [
                "device/b897584b-731b-4a73-9475-299c3090f4b4/0",
              ],
            },
          },
        },
        {
          $project:
            {
              _id: 1,
            },
        },
        {
          $lookup:
            {
              from: "devices",
              localField: "_id",
              foreignField: "data.mqttPrimeryTopicID",
              as: "result0",
            },
        },
        {
          $unwind: {
            path: "$result0",
          }
        },
        {
          $replaceRoot: {
            newRoot: "$result0"
          }
        },
      ]

    // const update: DeviceService.TUpdateDeviceProperties = {
    //     _id: message.deviceID,
    //     propertyToChange: {
    //         dataID: message.dataID,
    //         // @ts-ignore
    //         typeID: message.typeID,
    //         propertyName: "data",
    //         dataPropertyName: message.dataPropertyName,
    //         newValue: message.newValue,
    //     },
    // };

    // await DeviceService.updateDeviceProperties([update]);
}
