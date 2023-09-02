import React, { createContext, useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { ApiService } from '../../services/apiService';
import jwt_decode from "jwt-decode";
import Appdata from '../../services/appdataService';
const socketUrl = 'ws://10.0.0.12:5000/appdata/websocket';

type Props = {
  children: JSX.Element
}
//add type of app data to here
export type DataType = [
  appdata: Appdata,
  isAppdata: boolean
]

export const AppdataContext = createContext<DataType | null>(null);

// TODO: fix this claster-fuck :)
// TODO: use appdata service.ts
function AppdataProvider({ children }: Props) {
  const [appdata, setAppdata] = useState<Appdata>(Object);
  const [isAppdata, setIsAppdata] = useState(false);

  useEffect(() => {
    const websocket = new WebSocket(socketUrl);

    websocket.onopen = () => {
      console.log('connected');
    }

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const appdata = Appdata.createAppdataFromFetch(data)
      setAppdata(appdata);
      // console.log(data)
      // console.log(JSON.parse(event.data))
    }

    // return () => {
    //   websocket.close()
    // }
  }, [])

  useEffect(() => {
    setIsAppdata(appdata && Object.keys(appdata).length !== 0);
  }, [appdata])

  return (
    <AppdataContext.Provider value={[appdata, isAppdata]}>{children}</AppdataContext.Provider>
  )
}

export { AppdataProvider };