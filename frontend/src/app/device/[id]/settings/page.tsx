'use client'

import Loading from "@/components/loading";
import useGetDevice from "@/hooks/apis/devices/useGetDevice";
import usePostDeviceID from "@/hooks/apis/devices/usePostDeviceID";
import { ArrowBack, Done, Edit } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page({ params }: { params: { id: string } }) {
    const [isDeviceTaskName, setIsEditDeviceName] = useState(false);
    const [newDeviceName, setNewDeviceName] = useState("")
    const router = useRouter()
    const updateDeviceMutation = usePostDeviceID(params.id)
    const deviceQuerry = useGetDevice(params.id, [updateDeviceMutation.data])
    function goToTask() {
        router.push(`/device/${params.id}`)
    }

    function onOpenEditNameHandler() {
        if (!deviceQuerry.data?.deviceName) return

        setNewDeviceName(deviceQuerry.data?.deviceName)
        setIsEditDeviceName(true)
    }

    function onDoneEditNameHandler() {
        updateDeviceMutation.mutate([{
            propertyName: "deviceName",
            newValue: newDeviceName
        }])
        setIsEditDeviceName(false)
    }

    if (deviceQuerry.isLoading || deviceQuerry.isError) {
        <Loading />
    }

    return (
        <div className="pb-4">
            <div className="text-xl bg-neutral-200 dark:bg-darkNeutral-200 border-b border-solid border-neutral-500 px-2 pb-1 box-border sm:w-full sm:text-center flex justify-between items-center">
                <div className="flex justify-start items-center">
                    <ArrowBack className="w-7 h-7 fill-neutral-1000 dark:fill-darkNeutral-1000 dark:border-darkNeutral-300 border-neutral-300 mr-2 cursor-pointer" onClick={goToTask} />
                    {/* {taskQuery.data?.taskName} */}
                </div>
            </div>
            <div className="flex w-full flex-wrap">
                < div className='flex justify-between items-center pl-2 pr-2 w-full sm:justify-center flex-wrap' >
                    <h2 className="text-base w-full font-bold">
                        device ID:
                    </h2>
                    <div className="flex justify-between items-center w-full">
                        <p className="pl-2">{params.id}</p>
                    </div>
                </div>
                < div className='flex justify-between items-center pl-2 pr-2 w-full sm:justify-center flex-wrap' >
                    <h2 className="text-base w-full font-bold">
                        device name:
                    </h2>
                    {
                        isDeviceTaskName ?
                            <div className="flex justify-between items-center w-full">
                                <input
                                    className="pl-2"
                                    value={newDeviceName}
                                    onChange={(e) => { setNewDeviceName(e.target.value) }} />
                                <div>
                                    <Done className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 cursor-pointer' onClick={onDoneEditNameHandler} />
                                </div>
                            </div> :
                            <div className="flex justify-between items-center w-full">
                                <p className="pl-2">{deviceQuerry.data?.deviceName}</p>
                                <div>
                                    <Edit className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 cursor-pointer' onClick={onOpenEditNameHandler} />
                                </div>
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}