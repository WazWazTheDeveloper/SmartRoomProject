import styles from './App.module.css';
import React, { useState, useEffect } from 'react';
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import DeviceListScreen from './components/deviceScreen/DeviceSumScreen';

import { DevicesOther, AccessTime, Settings, Logout } from '@mui/icons-material';
import TaskListContainer from './components/taskScreen/TaskListContainer';
import { useAuth } from './hooks/useAuth';
import LoginScreen from './components/loginScreen/loginScreen';
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

  const [userdata, login, logout, signup, updateUserData, isError, error] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (userdata.token == "" && location.pathname != "/login") {
      navigate("/login")
    }
  },[location])

  
  return (
    <div className={styles.App}>
      <div className={styles.top}>
        <p>Smart Home Project</p>
      </div>
      <div className={styles.lower_container}>
        <div className={styles.side_bar}>
          <div className={styles.side_bar_icons}>
            <div className={styles.side_bar_item}>
              <Link to={'/'}>
                <DevicesOther className={styles.icon} />
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
          <div className={styles.side_bar_item}>
            {userdata.token != "" ?
              <Logout className={styles.icon} onClick={() => { logout() }} /> :
              <></>
            }
          </div>
        </div>
        <div className={styles.main}>
          <Routes>
            <Route path={'/'} element={<DeviceListScreen appdata={appdata} />} />
            <Route path={'/scheduled_tasks'} element={<TaskListContainer appdata={appdata} />} />
            <Route path={'/login'} element={<LoginScreen />} />

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
