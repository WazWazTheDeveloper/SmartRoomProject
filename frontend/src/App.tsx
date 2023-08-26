import styles from './App.module.css';
import React, { useState, useEffect } from 'react';
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import DeviceListScreen from './components/deviceScreen/deviceSummary/DeviceSumScreen';

import { DevicesOther, AccessTime, Settings, Logout } from '@mui/icons-material';
import TaskListContainer from './components/taskScreen/TaskListContainer';
import { useAuth } from './hooks/useAuth';
import LoginScreen from './components/loginScreen/loginScreen';
import DeviceDetailsContainer from './components/deviceScreen/deviceDetails/deviceDetailContainer';
import { useAppdata } from './hooks/useAppdata';
const socketUrl = 'ws://10.0.0.12:5000/appdata/websocket';

function App() {
  const appdata = useAppdata();
  const [userdata, login, logout, signup, updateUserData, isError, error] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // TODO: take a look at this
  useEffect(() => {
    if (userdata.token == "-1" && location.pathname != "/login") {
      navigate("/login")
    }
  }, [location, userdata.token])


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
            <Route path='/'>
              <Route index element={<DeviceListScreen appdata={appdata} />} />
              <Route path=':id/:dataat' element={<DeviceDetailsContainer />} />
            </Route>
            <Route path={'/scheduled_tasks'} element={<TaskListContainer appdata={appdata} />} />
            <Route path={'/login'} element={<LoginScreen />} />
            <Route path={'/test'} element={<DeviceDetailsContainer />} />

          </Routes>
        </div>
      </div>
    </div>
  );
}
export default App;
