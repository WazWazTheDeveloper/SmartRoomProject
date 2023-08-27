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
import TaskListContainer from './components/taskScreen/taskList/TaskListContainer';
import { useAuth } from './hooks/useAuth';
import LoginScreen from './components/loginScreen/loginScreen';
import DeviceDetailsContainer from './components/deviceScreen/deviceDetails/deviceDetailContainer';
import { useAppdata } from './hooks/useAppdata';
import useDidMount from './hooks/useDidMount';
import TaskDetailsContainer from './components/taskScreen/taskDetails/taskDetailsContainer';
const socketUrl = 'ws://10.0.0.12:5000/appdata/websocket';

function App() {
  const [userdata] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useDidMount(() => {
    if (userdata.token == "" && location.pathname != "/login") {
      navigate("/login")
    }
  }, [location, userdata.token])


  return (
    <div className={styles.App}>
      <TopBar />
      <div className={styles.lower_container}>
        <SideBar />
        <MainBody />
      </div>
    </div>
  );
}

function TopBar(props: any) {
  return (
    <div className={styles.top}>
      <p>Smart Home Project</p>
    </div>
  )
}

function MainBody(props: any) {
  return (
    <div className={styles.main}>
      <Routes>
        <Route path='/'>
          <Route index element={<DeviceListScreen />} />
          <Route path=':id/:dataat' element={<DeviceDetailsContainer />} />
        </Route>
        <Route path={'/scheduled_tasks'}>
          <Route index element={<TaskListContainer />} />
          <Route path=':taskid' element={<TaskDetailsContainer />} />
        </Route>
        <Route path={'/login'} element={<LoginScreen />} />
      </Routes>
    </div>
  )
}

function SideBar(props: any) {
  const [userdata, login, logout, signup, updateUserData, isError, error] = useAuth();

  return (
    <div className={styles.side_bar}>
      <div className={styles.side_bar_icons}>
        <div className={styles.side_bar_item}>
          <Link to={'/'}>
            <DevicesOther className={styles.icon} />
          </Link>
        </div>
        <div className={styles.side_bar_item}>
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
  )
}
export default App;
