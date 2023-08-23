import styles from './App.module.css';
import React, { useState, useCallback, useEffect } from 'react';
import {
  createBrowserRouter,
  Link,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import DeviceListScreen from './components/deviceScreen/DeviceSumScreen';

import { DevicesOther, AccessTime, Settings } from '@mui/icons-material';
import TaskListContainer from './components/taskScreen/TaskListContainer';
import { useAuth } from './hooks/useAuth';
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

  const [userdata, login, logout,updateUserData] = useAuth();
  return (
    <div className={styles.App}>
      <div className={styles.top}>
        <p>Smart Home Project</p>
      </div>
      <div className={styles.lower_container}>
        <div className={styles.side_bar}>
          <div className={styles.side_bar_item}>
            <Link to={'/'}>
              <DevicesOther className={styles.icon} onClick={() => {login("test2","123")}}/>
            </Link>
          </div>
          <div className={styles.side_bar_item}>
            {/* chage path */}
            <Link to={'/scheduled_tasks'}>
              <AccessTime className={styles.icon} />
            </Link>
          </div>
          <div className={styles.side_bar_item}>
            <Link to={'/settings'}>
              <Settings className={styles.icon} />
            </Link>
          </div>
        </div>
        <div className={styles.main}>
          <Routes>
            <Route path={'/'} element={<DeviceListScreen appdata={appdata} />} />
            <Route path={'/scheduled_tasks'} element={<TaskListContainer appdata={appdata} />} />

          </Routes>
        </div>
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
