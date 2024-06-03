"use client"

import usePostDevice from "@/hooks/apis/devices/usePostDevice";
import useGetUserSettings from "@/hooks/apis/users/useGetUserSettings";
import useAuth from "@/hooks/useAuth";
import { TDevice } from "@/interfaces/device.interface";
import { Add, Done, Edit } from "@mui/icons-material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

axios.defaults.withCredentials = true

type refreshType = {
  accessToken: string
}

export default function Home() {
  return (
    <main className="">
      <FavoriteDeviceSection />
    </main>
  );
}

function FavoriteDeviceSection() {
  const [deviceIDList, setDeviceIDList] = useState<string[]>([])
  const [isEditFavoriteDevices, setIsEditFavoriteDevices] = useState(false)
  const [isAddFavoriteDevices, setIsAddFavoriteDevices] = useState(false)

  const auth = useAuth();
  const userSettingsQuerry = useGetUserSettings(auth.userID)
  const deviceListQuerry = usePostDevice(deviceIDList)

  useEffect(() => {
    if (!userSettingsQuerry.data?.favoriteDevices) return
    const newDeviceIDList: string[] = []
    for (let index = 0; index < userSettingsQuerry.data.favoriteDevices.length; index++) {
      const element = userSettingsQuerry.data.favoriteDevices[index];
      newDeviceIDList.push(element.deviceID)
    }
    setDeviceIDList(newDeviceIDList)
  }, [userSettingsQuerry.data])

  function onEditFavoriteDevicesClickHandler() {
    setIsEditFavoriteDevices(true)
  }

  function onDoneFavoriteDevicesClickHandler() {
    setIsEditFavoriteDevices(false)
  }

  function onAddFavoriteDeviceClickHandler() {
    setIsAddFavoriteDevices(true)
  }

  function getFavoriteDevicesList() {
    if (!deviceListQuerry.data) return [<></>]
    const deviceElementArr = []
    for (let i = 0; i < deviceListQuerry.data.length; i++) {
      const element = deviceListQuerry.data[i];
      for (let j = 0; j < deviceListQuerry.data.length; j++) {
        if (i == j) {
          deviceElementArr.push(
            <div className="w-full" key={i}>
              <FavoriteDeviceListItem
                deviceID={element._id}
                deviceName={element.deviceName}
                isOnline={element.isConnected}
                isEditMode={isEditFavoriteDevices} />
            </div>
          )
        }
      }
    }
    return deviceElementArr
  }

  return (
    <>
      <div className="w-full flex justify-between">
        <h1 className="text-xl pl-1">
          Favorite devices
        </h1>
        <div>
          {isAddFavoriteDevices ? <></> :
            <Add className="w-7 h-7 fill-neutral-1000 dark:fill-darkNeutral-1000 dark:border-darkNeutral-300 border-neutral-300 cursor-pointer" onClick={onAddFavoriteDeviceClickHandler} />}
          {isEditFavoriteDevices ?
            <Done className="w-7 h-7 fill-neutral-1000 dark:fill-darkNeutral-1000 dark:border-darkNeutral-300 border-neutral-300 cursor-pointer" onClick={onDoneFavoriteDevicesClickHandler} /> :
            <Edit className="w-7 h-7 fill-neutral-1000 dark:fill-darkNeutral-1000 dark:border-darkNeutral-300 border-neutral-300 cursor-pointer" onClick={onEditFavoriteDevicesClickHandler} />}
        </div>
      </div>
      {
        // should be a selection of deviceName
        isAddFavoriteDevices ? <></> : <></>
      }
      {
        deviceListQuerry.data ? getFavoriteDevicesList() : <></>
      }
    </>
  )
}

type TProps = {
  deviceName: string
  isOnline: boolean
  deviceID: string
  isEditMode: boolean
}
function FavoriteDeviceListItem({ deviceName, isOnline, deviceID }: TProps) {
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
    </div>

  )
}