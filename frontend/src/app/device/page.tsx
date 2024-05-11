"use client"

import Loading from '@/components/loading';
import useAuth from '@/hooks/useAuth';
import axios from 'axios';
import { redirect, useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { useQuery } from 'react-query';
import { BounceLoader } from 'react-spinners'
export default function Page() {
    const auth = useAuth();
    const deviceQuery = useQuery({
        queryKey: ["devices"],
        queryFn: async () => {
            const res = await axios.get("/api/v1/device/", {
                headers: {
                    Authorization: `Bearer ${auth.authToken}`
                }
            })

            if (res.status == 401) {
                auth.refreshToken()
            }

            return res.data
        },
        enabled: auth.isAuthed
    });

    const ele: ReactNode[] = []
    if (deviceQuery.isFetched && !deviceQuery.isError) {
        console.log(deviceQuery.data)
        for (let i = 0; i < deviceQuery.data.length; i++) {
            const element = deviceQuery.data[i];
            ele.push((
                <ListItem deviceName={`${element.deviceName}`} isOnline={element.isConnected} deviceID={element._id} key={i}/>
            ))
        }
    }
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