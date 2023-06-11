// client/src/App.js

import React, { useState, useEffect, useCallback, useRef } from 'react';
import "./App.css";
import { initiateSocketConnection, disconnectSocket, subscribeToMessages, sendMessage, getBoard, joinRoom } from './socketio.service';
import { nanoid } from 'nanoid'

function App() {
  const [board, setBoard] = useState(null);
  const [cellStatuses, setCellStatuses] = useState(null);
  const [isRefreshingBoard, setIsRefreshingBoard] = useState(false);

  // useEffect(() => {
  //   fetch("/api")
  //     .then((res) => res.json())
  //     .then((board) => setBoard(board.message));
  // }, []);

  const [token, setToken] = useState('');

  const tokenInputRef = useRef('');
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (token) {
      initiateSocketConnection(token);
      joinRoom({token}, cb => {
        console.log("joined room");
        console.log(cb);
      })
      subscribeToMessages((err, data) => {
        console.log("SUBSCRIBED");
        console.log(data);
        setBoard(data[0]);
        setCellStatuses(data[1]);
      });
      getBoard({token}, cb => {
        console.log("CB IS");
        console.log(cb);
        console.log("DONE");
      });
      return () => {
        disconnectSocket();
      }
    }
  }, [token]);

  

  

  useEffect(() => {
    const submitMessage = (e) => {
      // e.preventDefault();
      const message = count;
      sendMessage({message, roomName: token}, cb => {
        console.log(cb);
      });
    };

    submitMessage();
  }, [count, token]);
  
  function getCellColor(cellNumber) {
    if (cellStatuses[cellNumber] === 0) {
      return "gray";
    } else if (cellStatuses[cellNumber] === 1) {
      return "red";
    } else if (cellStatuses[cellNumber] === -1) {
      return "blue";
    }
  }

  function cellClick(cellNumber) {
    const newCellStatuses = cellStatuses.map((c, i) => {
      if (i === cellNumber) {
        return c === 1 ? -1 : 1;
      } else {
        return c;
      }
    });
    setCellStatuses(newCellStatuses);
  }

  function display() {
    if (board && board.length === 25) {
      return (<div className="App">
      <header className="App-header">
        <table>
          <tr>
            <td style={{backgroundColor: getCellColor(0)}} onClick={() => {cellClick(0)}}>{board[0]}</td>
            <td>{board[1]}</td>
            <td>{board[2]}</td>
            <td>{board[3]}</td>
            <td>{board[4]}</td>
          </tr>
          <tr>
            <td>{board[5]}</td>
            <td>{board[6]}</td>
            <td>{board[7]}</td>
            <td>{board[8]}</td>
            <td>{board[9]}</td>
          </tr>
          <tr>
            <td>{board[10]}</td>
            <td>{board[11]}</td>
            <td>{board[12]}</td>
            <td>{board[13]}</td>
            <td>{board[14]}</td>
          </tr>
          <tr>
            <td>{board[15]}</td>
            <td>{board[16]}</td>
            <td>{board[17]}</td>
            <td>{board[18]}</td>
            <td>{board[19]}</td>
          </tr>
          <tr>
            <td>{board[20]}</td>
            <td>{board[21]}</td>
            <td>{board[22]}</td>
            <td>{board[23]}</td>
            <td>{board[24]}</td>
          </tr>
        </table>
      </header>
    </div>);
    }
    return (<div></div>)
  }

  const refreshBoard = useCallback(async () => {
    if (isRefreshingBoard) return;

    setIsRefreshingBoard(true);

    // fetch("/api")
    //     .then((res) => res.json())
    //     .then((board) => setBoard(board.message));
    getBoard({token}, cb => {
      console.log("CB IS");
      console.log(cb);
      console.log("DONE");
    });

    setIsRefreshingBoard(false);
  }, [isRefreshingBoard, token])

  const submitToken = (e) => {
    e.preventDefault();
    const tokenValue = tokenInputRef.current.value;
    setToken(tokenValue);
  }

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={submitToken}>
          <input type="text" placeholder="Enter Room Code" ref={tokenInputRef} />
          <button type="submit">Submit</button>
        </form>
        <button onClick={() => {
          var roomCode = nanoid(6);
          setToken(roomCode);
        }}>Create Room</button>
        <button disabled={isRefreshingBoard} onClick={refreshBoard}>Regenerate Board</button>
        <button onClick={() => {setCount(count + 1);}}>Add 1</button>
        {display()}
      </header>
    </div>
  );
}

export default App;