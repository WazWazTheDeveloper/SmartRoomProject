'use client';

import '../globals.css'
import DeviceSummary from '@/components/devices/deviceSummary/deviceSummary';
import { useAppdata } from '@/hooks/useAppdata';
import { useRouter } from 'next/navigation';
import React , {useEffect,useState} from 'react'


export default function Home() {
    const router = useRouter()
    const [appdata, isAppdata] = useAppdata();
    const [deviceList,setDeviceList] = useState<React.ReactNode>([])

    useEffect(()=>{
        if (isAppdata) {
            createDevices();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isAppdata,appdata])

    function createDevices() {
        let count = 0;
        let _deviceList = [];
        for (let index = 0; index < appdata.getDeviceList().length; index++) {
            const device = appdata.getDeviceList()[index];
            for (let index2 = 0; index2 < device.deviceData.length; index2++) {
                const data = device.deviceData[index2];
                let element =
                    <div key={index + "," + index2} className="relative h-fill  w-1/2 md:w-1/3 xl:w-1/4 2xl:w-1/6 flex content-center justify-center">
                        <DeviceSummary
                            uuid={device.uuid}
                            onClick={() => { router.push(`/devices/${device.uuid}`) }} />
                    </div>
                _deviceList.push(element)
                count++;
            }
        }

        // FIXME: this is not working as intented
        let numOfTiles = 2;
        if (window.screen.width > 768) {
            numOfTiles = 3
        }
        if (window.screen.width > 1024) {
            numOfTiles = 4
        }
        if (window.screen.width > 1280) {
            numOfTiles = 5
        }
        if (window.screen.width > 1536) {
            numOfTiles = 6
        }
        for (let index = count % numOfTiles; index < numOfTiles; index++) {
            let element =
                <div key={index + ","} className="relative h-60 w-1/2 md:w-1/3 xl:w-1/4 2xl:w-1/6 flex content-center justify-center">
                </div>
            _deviceList.push(element)
        }

        setDeviceList(_deviceList);
    }

    return (
        <main className="relative flex flex-wrap w-full min-h-full justify-between gap-y-5">
            {deviceList}
        </main>
    )
}
