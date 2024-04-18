import { Device } from "@/services/appdataService";
import { useAppdata } from "./useAppdata";
import React, { useEffect, useState } from "react";

export const useDevice = (_deviceId : string) => {
    const [appdata, isAppdata] = useAppdata();
    const [device, setDevice] = useState<Device>();
    const [deviceId,setDeviceId] = useState(_deviceId)
    useEffect(() => {
        if (isAppdata) {
            try {
                let _device: Device = appdata.getDeviceByUUID(deviceId)
                setDevice(_device)
            }
            catch (err) {
                // TODO: add error or somting
            }
        }
    }, [appdata, isAppdata, deviceId])

    return [device,setDeviceId] as const
}