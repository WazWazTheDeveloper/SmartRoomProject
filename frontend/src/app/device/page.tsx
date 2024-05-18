"use client"

import Loading from '@/components/loading';
import useGetDevices from '@/hooks/apis/useGetDevices';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
export default function Page() {
    const deviceQuery = useGetDevices();

    const ele: ReactNode[] = []
    if (deviceQuery.isFetched && !deviceQuery.isError) {
        for (let i = 0; i < deviceQuery.data.devices.length; i++) {
            const element = deviceQuery.data.devices[i];
            ele.push((
                <ListItem deviceName={`${element.deviceName}`} isOnline={element.isConnected} deviceID={element._id} key={i} />
            ))
        }
    }
    console.log(deviceQuery.data)
    return (
        <>
            <div className="text-xl bg-neutral-200 dark:bg-darkNeutral-200 border-b border-solid border-neutral-500 pl-2">
                Devices
            </div>
            {
                deviceQuery.isLoading ?
                    <Loading /> : <></>
            }
            {ele}
        </>
    )
}

type TProps = {
    deviceName: string
    isOnline: boolean
    deviceID: string
}

function ListItem({ deviceName, isOnline, deviceID }: TProps) {
    const onlineCSS = isOnline ? "bg-green-500" : "bg-red-500"
    const router = useRouter()
    function redirectToDevice() {
        router.push(`/device/${deviceID}`)
    }
    return (
        <div className="relative flex mt-1 bg-neutral-300 dark:bg-darkNeutral-300 cursor-pointer" onClick={redirectToDevice}>
            <div className={`w-full box-border h-12 pl-2 flex items-center`}>
                <div className={"w-6 h-6 rounded-full " + onlineCSS} />
                <h2 className="text-xl inline-block pl-1">
                    {deviceName}
                </h2>
            </div>
            {/* <div className="w-1/4 justify-end flex items-center pr-2">
                <EditIcon className="w-6 h-6 fill-neutral-1000 dark:fill-darkNeutral-1000" />
            </div> */}
        </div>

    )
}