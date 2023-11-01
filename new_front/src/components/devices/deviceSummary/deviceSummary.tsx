'use client';

import { Settings } from "@mui/icons-material"
import AirconditionerSummaryData from "./types/airconditionerSummaryData"
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from "react"
import DropdownMenu from "@/components/ui/dropdownMenu"
import { useApi } from "@/hooks/useApi"
import { ApiService } from "@/services/apiService"
import { useAuth } from "@/hooks/useAuth"

interface Data {
    isConnected: boolean
    deviceName: string
    data: {
        dataType: number
        data: {}
    }
    onClick: Function
    uuid: string
}

export default function DeviceSummary(props: Data) {
    const { fetchWithReauth } = useApi();
    const { userdata } = useAuth();

    let isConnectedDotClass = props.isConnected ? "bg-green-500" : "bg-[gray]"

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
        <Settings className="fill-on-surface h-full w-full"/>
    </div>

    return (
        <div className="relative max-w-60 min-w-32 md:w-60 md:h-60 bg-surface rounded-xl md:rounded-2xl cursor-pointer h-32 w-32" onClick={() => { props.onClick() }}>
            <div className="relative h-1/2 w-full flex flex-wrap">
                <div className="relative w-full h-1/2 flex items-center
                                after:content-[''] after:absolute after:m-auto after:right-0 after:bottom-0 after:left-0 after:w-full after:h-px after:bg-on-surface">
                    <p className="w-full text-left text-on-surface ml-3 md:ml-5 md:text-base text-xs">{props.deviceName}</p>
                    <DropdownMenu titleElement={settingTile} menuItems={settingTiles} />
                </div>
                <div className="relative w-full h-1/2 flex items-center 
                            after:content-[''] after:absolute after:m-auto after:right-0 after:bottom-0 after:left-0 after:w-full after:h-px after:bg-on-surface">

                    <div className={"relative md:ml-5 md:mr-1 md:w-9 md:h-9 mx-1 w-4 h-4 rounded-full flex items-center border-solid border-white border" + " " + isConnectedDotClass}></div>
                    <p className="text-left text-on-surface md:text-3xl text-sm">{props.isConnected ? "Online" : "Offline"}</p>
                </div>
            </div>
            <div className="relative h-1/2 w-full flex flex-wrap">
                {/* TODO: add switch case to this and more types */}
                <AirconditionerSummaryData data={props.data.data} />
            </div>
        </div>
    )
}