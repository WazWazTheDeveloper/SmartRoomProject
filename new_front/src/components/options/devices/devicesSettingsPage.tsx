'use client';

import { useAppdata } from "@/hooks/useAppdata";
import { AcceptDeviceLine } from "./AcceptDeviceLine";

export default function DevicesSettingsPage() {
    const [appdata, isAppdata] = useAppdata();

    let devicesElements = []
    if (isAppdata) {
        for (let index = 0; index < appdata.getDeviceList().length; index++) {
            const device = appdata.getDeviceList()[index];
            if (device.isAccepted == 0) {
                devicesElements.push(
                    <AcceptDeviceLine
                        deviceName={device.deviceName}
                        id={device.uuid}
                        key={index}
                        showDenyButton={true}
                    />)

            }
        }
        for (let index = 0; index < appdata.getDeviceList().length; index++) {
            const device = appdata.getDeviceList()[index];
            if (device.isAccepted == -1) {
                devicesElements.push(
                    <AcceptDeviceLine
                        deviceName={device.deviceName}
                        id={device.uuid}
                        key={index}
                        showDenyButton={false}
                    />)

            }
        }
    }

    return (
        <div className="w-full">
            {devicesElements}
        </div>
    )
}