'use client';

import { useAuth } from '@/hooks/useAuth';
import '../globals.css'
import DeviceSummary from '@/components/devices/deviceSummary/deviceSummary';
import { useAppdata } from '@/hooks/useAppdata';
import { useRouter } from 'next/navigation';


export default function Home() {
    const router = useRouter()
    const [appdata, isAppdata] = useAppdata();
    let _deviceList = [];

    // create this
    if (isAppdata) {
        let count = 0;
        _deviceList = [];
        for (let index = 0; index < appdata.getDeviceList().length; index++) {
            const device = appdata.getDeviceList()[index];
            for (let index2 = 0; index2 < device.deviceData.length; index2++) {
                const data = device.deviceData[index2];
                let element =
                    <div key={index +","+ index2} className="relative h-60 w-1/2 md:w-1/3 xl:w-1/4 2xl:w-1/6 flex content-center justify-center">
                        <DeviceSummary 
                        uuid={device.uuid} 
                        deviceName={device.deviceName} 
                        isConnected={device.isConnected} 
                        data={data} 
                        onClick={() => {router.push(`/devices/${device.uuid}`)}} />
                    </div>
                _deviceList.push(element)
                count++;
            }
        }

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
                <div key={index+","} className="relative h-60 w-1/2 md:w-1/3 xl:w-1/4 2xl:w-1/6 flex content-center justify-center">
                </div>
            _deviceList.push(element)
        }
    }


    return (
        <main className="flex flex-wrap w-full min-h-full justify-between gap-y-5">
            {_deviceList}
        </main>
    )
}
