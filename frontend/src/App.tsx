import logo from './logo.svg';
import './App.css';
import React, { useState, useCallback, useEffect } from 'react';

const socketUrl = 'ws://localhost:5000/appdata/websocket';


function App() {

  useEffect(() => {
    const websocket = new WebSocket(socketUrl);

    websocket.onopen = () => {
      console.log('connected');
    }

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(JSON.parse(event.data))
    }
  
    // return () => {
    //   websocket.close()
    // }
  }, [])

  return (
    <div className="App">
      <header className="App-header">
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
      </header>
    </div>
  );
}
export default App;
