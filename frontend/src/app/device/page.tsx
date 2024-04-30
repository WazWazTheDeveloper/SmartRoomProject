"use client"

import useAuth from '@/hooks/useAuth';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { useQuery } from 'react-query';

export default function Page() {
    const auth = useAuth();
    const deviceQuery = useQuery({
        queryKey : ["devices"],
        queryFn : async () => {
            const res = await axios.get("/api/v1/device/",{
                headers : {
                    Authorization : `Bearer ${auth.authToken}`
                }
            })

            return res.data
        }
    });

    
    return (
        <>
            <div className="text-3xl bg-neutral-200 dark:bg-neutral-200 border-b border-solid border-neutral-500 p-2">
                Devices
            </div>
            <ListItem deviceName={"text"} isOnline={true}/>
            <ListItem deviceName={"test2"} isOnline={true}/>
            <ListItem deviceName={"test3"} isOnline={false}/>
        </>
    )
}

type TProps = {
    deviceName : string
    isOnline : boolean
}

function ListItem({deviceName,isOnline} : TProps) {
    const onlineCSS = isOnline ? "bg-green-500" : "bg-red-500"
    return (
        <div className="relative flex mt-1 bg-neutral-300 dark:bg-neutral-300">
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