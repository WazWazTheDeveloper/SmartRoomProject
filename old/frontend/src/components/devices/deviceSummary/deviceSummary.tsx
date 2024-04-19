'use client';

import { BrandingWatermark, Settings } from "@mui/icons-material"
import AirconditionerSummaryData from "./types/airconditionerSummaryData"
import { Menu, Transition } from '@headlessui/react'
import { Fragment, useState, useEffect, Suspense } from "react"
import DropdownMenu from "@/components/ui/dropdownMenu"
import { useApi } from "@/hooks/useApi"
import { ApiService } from "@/services/apiService"
import { useAuth } from "@/hooks/useAuth"
import { useDevice } from "@/hooks/useDevice";
import { useAppdata } from "@/hooks/useAppdata";
import SwitchSummaryData from "./types/switchSummaryData";
import PopupWindow from "@/components/ui/popupWindow";
import DeviceSettings from "../deviceSettings/deviceSettings";
import { DataType } from "@/services/appdataService";

interface Data {
    onClick: Function
    uuid: string
}

export default function DeviceSummary(props: Data) {
    const [appdata, isAppdata] = useAppdata();
    const { fetchWithReauth } = useApi();
    const { userdata } = useAuth();
    const [deviceDataElement, setDeviceDataElement] = useState<React.ReactNode>(<></>);
    const [device, setDeviceId] = useDevice(props.uuid);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    let isConnectedDotClass = device?.isConnected ? "bg-green-500" : "bg-[gray]"

    function deleteDevice(e: React.MouseEvent<SVGSVGElement>) {
        console.log(props.uuid)
        e.stopPropagation();
        console.log(props.uuid)
        // let delete_path = '/device/delete_device?uuid=' + props.uuid;
        // fetchWithReauth(delete_path, ApiService.REQUEST_POST, userdata.token)
    }

    // TODO: add on click
    let settingTiles = [
        {
            "itemTitle": "Settings",
            "onClick": () => { }
        }, {
            "itemTitle": "Delete",
            "onClick": deleteDevice,
        },
    ]

    let settingTile =
        <div className="duration-200 hover:scale-105 w-6 h-6 md:h-10 md:w-10">
            <Settings className="fill-on-surface h-full w-full" />
        </div>

    useEffect(() => {
        if (!isAppdata || !device) {
            setDeviceDataElement(<p className="text-on-surface text-center">{`there is more then one data type in this device and I still haven't figured somting`}</p>);
            return
        }
        for (let index = 0; index < device.deviceData.length; index++) {
            const _deviceData = device.deviceData[index];
            switch (_deviceData.dataType) {
                case DataType.AIRCONDITIONER_TYPE:
                    setDeviceDataElement(
                        <AirconditionerSummaryData
                            data={device.deviceData[index].data}
                        />)
                    break;
                case DataType.SWITCH_TYPE:
                    setDeviceDataElement(
                        <SwitchSummaryData
                            data={device.deviceData[index].data}
                        />)
                    break;
                default:
                    // TODO: make thi pretty
                    setDeviceDataElement(<p className="text-on-surface text-center">{"not implementer yet datatype:" + _deviceData.dataType}</p>);
                    break;
            }
        }
    }, [isAppdata, device, appdata])

    function openSettingsWindow(e: React.MouseEvent<SVGSVGElement>) {
        e.stopPropagation();
        setIsSettingsOpen(true)
    }

    function closeSettingsWindow() {
        setIsSettingsOpen(false)
    }

    return (
        <>
            <PopupWindow onClose={closeSettingsWindow} title='Device settings' className='flex justify-start w-4/5' isOpen={isSettingsOpen}>
                {isSettingsOpen ?
                    <DeviceSettings uuid={props.uuid} closeWindow={closeSettingsWindow} /> :
                    <></>}
            </PopupWindow>
            <div className="relative max-w-60 min-w-32 md:w-60 md:h-60 bg-surface rounded-xl md:rounded-2xl cursor-pointer h-32 w-32" onClick={() => { props.onClick() }}>
                <div className="relative h-1/2 w-full flex flex-wrap">
                    <div className="relative w-full h-1/2 flex items-center
                                after:content-[''] after:absolute after:m-auto after:right-0 after:bottom-0 after:left-0 after:w-full after:h-px after:bg-on-surface">
                        <p className="w-full text-left text-on-surface ml-3 md:ml-5 md:text-base text-xs">{device?.deviceName}</p>
                        {/* <DropdownMenu titleElement={settingTile} menuItems={settingTiles} /> */}
                        {userdata.isAdmin ?
                            <Settings className="fill-on-surface md:mr-2.5 cursor-pointer mr-1 duration-200 hover:scale-105 w-6 h-6 md:h-10 md:w-10" onClick={openSettingsWindow} /> :
                            <div className="md:mr-2.5 mr-1 duration-200 w-6 h-6 md:h-10 md:w-10"/>
                        }
                    </div>
                    <div className="relative w-full h-1/2 flex items-center 
                            after:content-[''] after:absolute after:m-auto after:right-0 after:bottom-0 after:left-0 after:w-full after:h-px after:bg-on-surface">

                        <div className={"relative md:ml-5 md:mr-1 md:w-9 md:h-9 mx-1 w-4 h-4 rounded-full flex items-center border-solid border-white border" + " " + isConnectedDotClass}></div>
                        <p className="text-left text-on-surface md:text-3xl text-sm">{device?.isConnected ? "Online" : "Offline"}</p>
                    </div>
                </div>
                <div className="relative h-1/2 w-full flex flex-wrap">
                    {deviceDataElement}
                </div>
            </div>
        </>
    )
}