'use client'

import AirconditionerDetailsData from "@/components/devices/deviceDetails/types/airconditionerDetailsData";
import SwitchDetailsData from "@/components/devices/deviceDetails/types/switchDetailsData";
import { useAppdata } from "@/hooks/useAppdata";
import { Device } from "@/services/appdataService";
import Error from "next/error";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AIRCONDITIONER_TYPE = 0;
const SWITCH_TYPE = 1;

export default function Page({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [appdata, isAppdata] = useAppdata();
    const [device, setDevice] = useState<Device>();
    const [deviceDataElements, setDeviceDataElements] = useState<React.ReactNode>([]);
    const [isValidId, setIsValidId] = useState(true);
    useEffect(() => {
        if (isAppdata) {
            try {
                let _device: Device = appdata.getDeviceByUUID(params.id)
                setDevice(_device)
            }
            catch (err) {
                setIsValidId(false)
            }
        }
    }, [appdata, isAppdata, params.id])
    useEffect(() => {
        if (isAppdata && device) {
            let _newElements = [];
            for (let index = 0; index < device.deviceData.length; index++) {
                const _device = device.deviceData[index];
                switch (device.deviceData[0].dataType) {
                    case AIRCONDITIONER_TYPE:
                        _newElements.push(
                            <AirconditionerDetailsData
                                targetDevice={String(params.id)}
                                dataAt={Number(0)}
                                data={device.deviceData[0].data}
                                key={index}
                            />);
                        break;
                    case SWITCH_TYPE:
                        _newElements.push(
                            <SwitchDetailsData
                                targetDevice={String(params.id)}
                                dataAt={Number(0)}
                                key={index}
                            />);
                        break;
                    default:
                        _newElements.push(<></>);
                        break;

                }
            }
            setDeviceDataElements(_newElements);
        }
    }, [isAppdata, appdata, device, params.id])


    console.log(isValidId)
    if (!isValidId) {
        return (
            <Error statusCode={404} />
        )
    }
    if (!device) {
        return (
            <></>
        )
    }
    return (
        <div className="w-full flex justify-center">
            <div className="w-full md:w-4/5 flex content-start flex-wrap bg-surface">
                <h1 className="w-full text-on-surface text-xl text-center">
                    {device.deviceName}
                </h1>
                <div className="w-full flex content-center items-start flex-wrap gap-y-4">
                    {deviceDataElements}
                </div>
            </div>
        </div>
    )
}