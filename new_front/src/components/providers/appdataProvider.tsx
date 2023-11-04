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
  const { userdata, login, logout, signup, updateUserData, isError, error } = useAuth();

  // const websocket = new WebSocket(socketUrl);
  const [webSocketReady, setWebSocketReady] = useState(false);
  const [webSocket, setWebSocket] = useState(new WebSocket(socketUrl));
  
  useEffect(() => {
  webSocket.onopen = () => {
    webSocket.send(userdata.token)
      setWebSocketReady(true)
      console.log('connected');
    }

    webSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const appdata = Appdata.createAppdataFromFetch(data)
      console.log(appdata);
      setAppdata(appdata);
    }

    webSocket.onclose = () => {
      setWebSocketReady(false);
      console.log('disconnected');
      setTimeout(() => {
        setWebSocket(new WebSocket(socketUrl));
      }, 1000);
    }

    return () => {
      if (webSocket.readyState === 1) { // <-- This is important
        webSocket.close();
      }
    }
  }, [webSocket])

  useEffect(() => {
    if (webSocket.readyState === 1 && webSocketReady) { // <-- This is important
      webSocket.send(userdata.token);
    }
  },[userdata.token , webSocketReady])

  useEffect(() => {
    setIsAppdata(appdata && Object.keys(appdata).length !== 0);
  }, [appdata])

  return (
    <AppdataContext.Provider value={[appdata, isAppdata]}>{children}</AppdataContext.Provider>
  )
}

export { AppdataProvider };