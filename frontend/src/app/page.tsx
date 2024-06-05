"use client"

import useGetDevices from "@/hooks/apis/devices/useGetDevices";
import usePostDevice from "@/hooks/apis/devices/usePostDevice";
import useGetUserSettings from "@/hooks/apis/users/useGetUserSettings";
import usePatchFavoriteDevice from "@/hooks/apis/users/usePatchFavoriteDevice";
import useAuth from "@/hooks/useAuth";
import { TDevice } from "@/interfaces/device.interface";
import { Add, ArrowDownward, ArrowUpward, Delete, Done, Edit, Key } from "@mui/icons-material";
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
  const [newFavoriteDeviceID, setNewFavoriteDeviceID] = useState("")

  const auth = useAuth();
  const userDevicesListQuerry = useGetDevices()
  const addUserFavoriteDeviceMutation = usePatchFavoriteDevice()
  const userSettingsQuerry = useGetUserSettings(auth.userID, [addUserFavoriteDeviceMutation.data])
  const deviceListQuerry = usePostDevice(deviceIDList,[deviceIDList])

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
    setNewFavoriteDeviceID("")
  }

  function onDoneFavoriteDeviceClickHandler() {
    if (newFavoriteDeviceID != "") {
      addUserFavoriteDeviceMutation.mutate({
        newFavoriteDeviceID: newFavoriteDeviceID,
        userID: auth.userID
      })
    }
    setIsAddFavoriteDevices(false)
  }

  function getFavoriteDevicesList() {
    if (!userSettingsQuerry.data?.favoriteDevices) return [<></>]
    if (!deviceListQuerry.data) return [<></>]
    const deviceElementArr = []
    console.log(userSettingsQuerry.data?.favoriteDevices.length)
    console.log(deviceListQuerry.data.length)
    for (let i = 0; i < userSettingsQuerry.data?.favoriteDevices.length; i++) {
      const settings = userSettingsQuerry.data?.favoriteDevices[i];
      let isAdded = false
      for (let j = 0; j < deviceListQuerry.data.length; j++) {
        const device = deviceListQuerry.data[j];
        console.log(settings.deviceID)
        console.log(device._id)
        if (settings.deviceID == device._id) {
          console.log("te")
          deviceElementArr.push(
            <div className="w-full" key={`${i},${j}`}>
              <FavoriteDeviceListItem
                deviceID={device._id}
                deviceName={device.deviceName}
                isOnline={device.isConnected}
                isEditMode={isEditFavoriteDevices}
                isClickable={true} />
            </div>
          )
          isAdded = true
        }
      }
      if (!isAdded) {
        deviceElementArr.push(
          <div className="w-full" key={i}>
            <FavoriteDeviceListItem
              deviceID={""}
              deviceName={"error"}
              isOnline={false}
              isEditMode={isEditFavoriteDevices}
              isClickable={false} />
          </div>
        )
      }
    }
    return deviceElementArr
  }

  return (
    <div key={'key'}>
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
        isAddFavoriteDevices && userDevicesListQuerry.data?.devices && Array.isArray(userDevicesListQuerry.data.devices) ?
          <div className="flex w-full justify-between items-center">
            <div className="flex w-full items-center">
              <h1 className="text-base">New device to add:</h1>
              <select name="device" id="device" className="mr-1"
                key={-1}
                onChange={(e) => { setNewFavoriteDeviceID(e.target.value) }}>
                <option value={""}></option>
                {userDevicesListQuerry.data?.devices.map((element: TDevice, index: number) => {
                  return (
                    <option key={index} value={element._id}>{`${element.deviceName}`}</option>
                  )
                })}
              </select>
            </div>
            <Done className="w-7 h-7 fill-neutral-1000 dark:fill-darkNeutral-1000 dark:border-darkNeutral-300 border-neutral-300 cursor-pointer" onClick={onDoneFavoriteDeviceClickHandler} />
          </div>
          : <></>
      }
      {
        userSettingsQuerry.data ? getFavoriteDevicesList() : <></>
      }
    </div>
  )
}

type TProps = {
  deviceName: string
  isOnline: boolean
  deviceID: string
  isEditMode: boolean
  isClickable: boolean
}
function FavoriteDeviceListItem({ deviceName, isOnline, deviceID, isClickable, isEditMode }: TProps) {
  const onlineCSS = isOnline ? "bg-green-500" : "bg-red-500"
  const router = useRouter()
  function redirectToDevice() {
    if (!isClickable) return
    router.push(`/device/${deviceID}`)
  }
  return (
    <div className="relative flex mt-1 bg-neutral-300 dark:bg-darkNeutral-300 cursor-pointer" onClick={redirectToDevice}>
      <div className={`w-full box-border h-12 pl-2 flex items-center justify-between`}>
        <div className="flex items-center">
          <div className={"w-6 h-6 rounded-full " + onlineCSS} />
          <h2 className="text-xl inline-block pl-1">
            {deviceName}
          </h2>
        </div>
        {isEditMode ? <div>
          <ArrowUpward className="w-7 h-7 fill-neutral-1000 dark:fill-darkNeutral-1000 dark:border-darkNeutral-300 border-neutral-300 cursor-pointer" />
          <ArrowDownward className="w-7 h-7 fill-neutral-1000 dark:fill-darkNeutral-1000 dark:border-darkNeutral-300 border-neutral-300 cursor-pointer" />
          <Delete className="w-7 h-7 fill-neutral-1000 dark:fill-darkNeutral-1000 dark:border-darkNeutral-300 border-neutral-300 cursor-pointer" />
        </div> : <></>}
      </div>
    </div>

  )
}