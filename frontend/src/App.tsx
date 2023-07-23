import logo from './logo.svg';
import './App.css';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import React, { useState, useCallback, useEffect } from 'react';

const socketUrl = 'ws://localhost:5000';


function App() {
  // const {
  //   sendMessage,
  //   sendJsonMessage,
  //   lastMessage,
  //   lastJsonMessage,
  //   readyState,
  //   getWebSocket,
  // } = useWebSocket('wss://echo.websocket.org', {
  //   onOpen: () => console.log('opened'),
  //   shouldReconnect: (closeEvent) => true,
  // });

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

// function x() {
//   fetch('/appdata/addGeneralTopic', {
//     method: 'POST',
//     body: JSON.stringify({
//       // "x" : "test",
//       // "yt" : "tes"
//     }),
//     headers: {
//       'Content-type': 'application/json; charset=UTF-8',
//     },
//   })
//      .then((response) => response.json())
//      .then((data) => {
//         console.log(data);
//         // Handle data
//      })
//      .catch((err) => {
//         console.log(err.message);
//      });
// }

export default App;
