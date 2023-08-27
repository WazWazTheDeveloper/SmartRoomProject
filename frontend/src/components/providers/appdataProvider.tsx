import React, { createContext, useState, useEffect} from 'react';
import { useApi } from '../../hooks/useApi';
import { ApiService } from '../../services/apiService';
import jwt_decode from "jwt-decode";
const socketUrl = 'ws://10.0.0.12:5000/appdata/websocket';

type Props = {
    children: JSX.Element
}
//add type of app data to here
export type DataType = [

]

export const AppdataContext = createContext<any | null>(null);

// TODO: fix this claster-fuck :)
// TODO: use appdata service.ts
function AppdataProvider({ children }: Props) {
    const [appdata, setAppdata] = useState(Object);

    useEffect(() => {
      const websocket = new WebSocket(socketUrl);
  
      websocket.onopen = () => {
        console.log('connected');
      }
  
      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setAppdata(data);
        // console.log(data)
        // console.log(JSON.parse(event.data))
      }
  
      // return () => {
      //   websocket.close()
      // }
    }, [])

    return (
        <AppdataContext.Provider value={appdata}>{children}</AppdataContext.Provider>
    )
}

export { AppdataProvider };