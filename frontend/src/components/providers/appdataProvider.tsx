import React, { createContext, useState, useEffect } from 'react';
import Appdata from '../../services/appdataService';
import { useAuth } from '../../hooks/useAuth';
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
  const [userdata, login, logout, signup, updateUserData, isError, error] = useAuth();

  const websocket = new WebSocket(socketUrl);

  useEffect(() => {

    websocket.onopen = () => {
      websocket.send(userdata.token)
      console.log('connected');
    }

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const appdata = Appdata.createAppdataFromFetch(data)
      // console.log(appdata)
      setAppdata(appdata);
      // console.log(JSON.parse(event.data))
    }

    return () => {
      websocket.close()
    }
    // if(websocket.OPEN == websocket.readyState) {
    //   websocket.send(userdata.token)
    // }
  }, [userdata])

  useEffect(() => {
    setIsAppdata(appdata && Object.keys(appdata).length !== 0);
  }, [appdata])

  return (
    <AppdataContext.Provider value={[appdata, isAppdata]}>{children}</AppdataContext.Provider>
  )
}

export { AppdataProvider };