'use client'

import AirconditionerDetailsData from "@/components/devices/deviceDetails/types/airconditionerDetailsData";
import { useAppdata } from "@/hooks/useAppdata";
import { Device } from "@/services/appdataService";
import { useEffect, useState } from "react";


export default function Page({ params }: { params: { id: string } }) {
    const [appdata, isAppdata] = useAppdata();
    const [device, setDevice] = useState<Device>();

    useEffect(() => {
        if (isAppdata) {
            try {
                let _device: Device = appdata.getDeviceByUUID(params.id)
                setDevice(_device)
            }
            catch (err) {
                // TODO: add error of 404 or somting
            }
        }
    }, [appdata, isAppdata, params.id])

    if(!device) {
        return <></>
    }
    
    return (
        <div className="w-full flex justify-center">
            <div className="w-full md:w-4/5 flex content-start flex-wrap bg-surface">
                <h1 className="w-full text-on-surface text-xl text-center">
                    {device.deviceName}
                </h1>
                <div className="w-full flex content-center items-start flex-wrap gap-y-4">
                    <AirconditionerDetailsData
                        targetDevice={String(params.id)}
                        dataAt={Number(0)}
                        data={device.deviceData[0].data}
                    />
                </div>

            </div>
        </div>
    )
}