'use client'

import MultiStateButtonData from "@/components/dataTypes/multiStateButtonData";
import NumberData from "@/components/dataTypes/numberData";
import SwitchData from "@/components/dataTypes/switchData";
import Loading from "@/components/loading";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { BounceLoader } from "react-spinners";

type TResponseType = {
    _id: string;
    deviceTargetID: string;
    deviceName: string;
    mqttTopicID: string;
    previousTopicID: string;
    isAccepted: -1 | 0 | 1;
    isAdminOnly: boolean;
    data: TDeviceDataObject[];
    isConnected: boolean;
    isConnectedCheck: boolean;
}

type TDeviceDataObject = TSwitchData | TNumberData | TMultiStateButton;

export type TDeviceData = {
    dataID: number
    typeID: number
    iconName: string
    dataTitle: string
    isSensor: boolean
    mqttTopicID: string
}

export type TSwitchData = {
    isOn: boolean
    onName: string
    offName: string
} & TDeviceData

export type TNumberData = {
    currentValue: number
    minValue: number
    maxValue: number
    jumpValue: number
    symbol: string
} & TDeviceData

export type TMultiStateButton = {
    currentState: number
    stateList: TStateItem[]
} & TDeviceData

export type TStateItem = {
    stateValue: number
    isIcon: boolean
    icon: string
    stateTitle: string
}

const SWITCH_TYPE = 0
const NUMBER_TYPE = 1
const MULTI_STATE_BUTTON_TYPE = 2


export default function Page({ params }: { params: { id: string } }) {
    const [deviceName, setDeviceName] = useState("")
    const [isOnline, setIsOnline] = useState(false)
    const auth = useAuth();
    const deviceQuery = useQuery({
        queryKey: ["devices"],
        queryFn: async () => {
            const res = await axios.get(`/api/v1/device/${params.id}`, {
                headers: {
                    Authorization: `Bearer ${auth.authToken}`
                }
            })

            if (res.status == 401) {
                auth.refreshToken()
            }

            return res.data as TResponseType
        },
        enabled: auth.isAuthed
    });

    useEffect(() => {
        if (deviceQuery.isLoading) return
        if (deviceQuery.isError) return

        if (deviceQuery.data?.deviceName) {
            setDeviceName(deviceQuery.data.deviceName)
        }
        if (deviceQuery.data?.isConnected) {
            setIsOnline(deviceQuery.data.isConnected)
        }

    }, [deviceQuery.data])

    if (deviceQuery.isLoading) {
        return (<Loading />)
    }

    return (
        <>
            <div className="text-xl bg-neutral-200 dark:bg-darkNeutral-200 border-b border-solid border-neutral-500 pl-2">
                {deviceName}
            </div>
            <div className="flex w-full flex-wrap">
                <div className="w-full">
                    {
                        isOnline ?
                            <p className="pl-2 pt-1 pb-1 text-green-500 font-semibold">
                                online
                            </p> :
                            <p className="pl-2 pt-1 pb-1 text-red-500 font-semibold">
                                offline
                            </p>
                    }
                </div>
                {
                    Array.isArray(deviceQuery.data?.data) ?
                        deviceQuery.data.data.map((data: TDeviceDataObject, index: number) => {
                            let component = <></>;
                            switch (data.typeID) {
                                case (SWITCH_TYPE): {
                                    component = <SwitchData />
                                    break;
                                }
                                case (NUMBER_TYPE): {
                                    component = <NumberData />
                                    break;
                                }
                                case (MULTI_STATE_BUTTON_TYPE): {
                                    component = <MultiStateButtonData />
                                    break;
                                }
                                default: {
                                    return <></>
                                }
                            }
                            return (
                                <div className="w-full" key={index}>
                                    {component}
                                </div>
                            )
                        }) : <></>
                }
            </div>
        </>
    )
}