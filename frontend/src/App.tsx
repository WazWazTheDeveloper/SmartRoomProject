import styles from './App.module.css';
import React, { useState, useCallback, useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import DeviceListScreen from './components/DeviceSumScreen';

import {DevicesOther, AccessTime,Settings } from '@mui/icons-material';
const socketUrl = 'ws://10.0.0.12:5000/appdata/websocket';

function App() {

  const [appdata, setAppdata] = useState(Object);

  useEffect(() => {
    const websocket = new WebSocket(socketUrl);

    websocket.onopen = () => {
      console.log('connected');
    }

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setAppdata(data);
      // console.log(JSON.parse(event.data))
    }

    // return () => {
    //   websocket.close()
    // }
  }, [])

  const router = createBrowserRouter([
    {
      path: "/",
      element: <DeviceListScreen appdata={appdata} />,
    }, {
      path: "/1",
      element: <div>Hello wo111rld!</div>,
    },
  ]);

  return (
    <div className={styles.App}>
      <div className={styles.top}>
        <p>Smart Home Project</p>
      </div>
      <div className={styles.lower_container}>
        <div className={styles.side_bar}>
          <div className={styles.side_bar_item}>
            <DevicesOther className={styles.icon} />
          </div>
          <div className={styles.side_bar_item}>
            <AccessTime className={styles.icon} />
          </div>
          <div className={styles.side_bar_item}>
            <Settings  className={styles.icon} />
          </div>
        </div>
        <div className={styles.main}><RouterProvider router={router} /></div>
      </div>


      {/* <DeviceSumContainer /> */}
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );
}
export default App;
