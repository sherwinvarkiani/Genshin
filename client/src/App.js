// client/src/App.js

import React, { useState, useEffect, useCallback, useRef } from 'react';
import "./App.css";
import { initiateSocketConnection, disconnectSocket, subscribeToMessages, updateStatus, getBoard, joinRoom, createRoom } from './socketio.service';
import { nanoid } from 'nanoid'

function App() {
  const [board, setBoard] = useState(null);
  const [cellStatuses, setCellStatuses] = useState(null);
  const [isRefreshingBoard, setIsRefreshingBoard] = useState(false);

  const [token, setToken] = useState('');
  const [playerNum, setPlayerNum] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const tokenInputRef = useRef('');

  useEffect(() => {
    if (token) {
      initiateSocketConnection(token);

      if (playerNum === 1) {
        createRoom({token}, cb => {
          console.log(cb);
        })
      } else if (playerNum === 2) {
        joinRoom({token}, cb => {
          console.log(cb);
          if (cb['status'] === "error: too many users in room") {
            console.log("too many users in room");
            setErrorMsg("Error: The room is full. Please try another room");
            setToken('');
            return;
          }
        })
      }
      subscribeToMessages((err, data) => {
        console.log(data);
        setBoard(data[0]);
        setCellStatuses(data[1]);
      });
      getBoard({token}, cb => {
        console.log(cb);
      });
      return () => {
        disconnectSocket();
      }
    }
  }, [token, playerNum]);
  
  function getCellColor(cellNumber) {
    if (cellStatuses[cellNumber] === 0) {
      return "gray";
    } else if (cellStatuses[cellNumber] === 1) {
      return "red";
    } else if (cellStatuses[cellNumber] === 2) {
      return "blue";
    }
  }

  function cellClick(cellNumber) {
    const newCellStatuses = cellStatuses.map((c, i) => {
      if (i === cellNumber && cellStatuses[cellNumber] === 0) {
        return playerNum;
      } else {
        return c;
      }
    });
    setCellStatuses(newCellStatuses);
    updateStatus({newCellStatuses, token}, cb => {
      console.log(cb);
    });
  }

  function display() {
    if (board && board.length === 25) {
      return (<div className="App">
      <header className="App-header">
        <table>
          <tr>
            <td style={{backgroundColor: getCellColor(0)}} onClick={() => {cellClick(0)}}>{board[0]}</td>
            <td style={{backgroundColor: getCellColor(1)}} onClick={() => {cellClick(1)}}>{board[1]}</td>
            <td style={{backgroundColor: getCellColor(2)}} onClick={() => {cellClick(2)}}>{board[2]}</td>
            <td style={{backgroundColor: getCellColor(3)}} onClick={() => {cellClick(3)}}>{board[3]}</td>
            <td style={{backgroundColor: getCellColor(4)}} onClick={() => {cellClick(4)}}>{board[4]}</td>
          </tr>
          <tr>
            <td style={{backgroundColor: getCellColor(5)}} onClick={() => {cellClick(5)}}>{board[5]}</td>
            <td style={{backgroundColor: getCellColor(6)}} onClick={() => {cellClick(6)}}>{board[6]}</td>
            <td style={{backgroundColor: getCellColor(7)}} onClick={() => {cellClick(7)}}>{board[7]}</td>
            <td style={{backgroundColor: getCellColor(8)}} onClick={() => {cellClick(8)}}>{board[8]}</td>
            <td style={{backgroundColor: getCellColor(9)}} onClick={() => {cellClick(9)}}>{board[9]}</td>
          </tr>
          <tr>
            <td style={{backgroundColor: getCellColor(10)}} onClick={() => {cellClick(10)}}>{board[10]}</td>
            <td style={{backgroundColor: getCellColor(11)}} onClick={() => {cellClick(11)}}>{board[11]}</td>
            <td style={{backgroundColor: getCellColor(12)}} onClick={() => {cellClick(12)}}>{board[12]}</td>
            <td style={{backgroundColor: getCellColor(13)}} onClick={() => {cellClick(13)}}>{board[13]}</td>
            <td style={{backgroundColor: getCellColor(14)}} onClick={() => {cellClick(14)}}>{board[14]}</td>
          </tr>
          <tr>
            <td style={{backgroundColor: getCellColor(15)}} onClick={() => {cellClick(15)}}>{board[15]}</td>
            <td style={{backgroundColor: getCellColor(16)}} onClick={() => {cellClick(16)}}>{board[16]}</td>
            <td style={{backgroundColor: getCellColor(17)}} onClick={() => {cellClick(17)}}>{board[17]}</td>
            <td style={{backgroundColor: getCellColor(18)}} onClick={() => {cellClick(18)}}>{board[18]}</td>
            <td style={{backgroundColor: getCellColor(19)}} onClick={() => {cellClick(19)}}>{board[19]}</td>
          </tr>
          <tr>
            <td style={{backgroundColor: getCellColor(20)}} onClick={() => {cellClick(20)}}>{board[20]}</td>
            <td style={{backgroundColor: getCellColor(21)}} onClick={() => {cellClick(21)}}>{board[21]}</td>
            <td style={{backgroundColor: getCellColor(22)}} onClick={() => {cellClick(22)}}>{board[22]}</td>
            <td style={{backgroundColor: getCellColor(23)}} onClick={() => {cellClick(23)}}>{board[23]}</td>
            <td style={{backgroundColor: getCellColor(24)}} onClick={() => {cellClick(24)}}>{board[24]}</td>
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

    getBoard({token}, cb => {
      console.log(cb);
    });

    setIsRefreshingBoard(false);
  }, [isRefreshingBoard, token])

  const submitToken = (e) => {
    e.preventDefault();
    const tokenValue = tokenInputRef.current.value;
    setToken('');
    setErrorMsg('');
    setPlayerNum(2);
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
          setToken('');
          setErrorMsg('');
          setPlayerNum(1);
          setToken(roomCode);
        }}>Create Room</button>
        <button disabled={isRefreshingBoard} onClick={refreshBoard}>Regenerate Board</button>
        {token !== '' ? <h1>Room Code: {token}</h1> : <div></div>}
        {errorMsg !== '' ? <h2>{errorMsg}</h2> : <div></div>}
        {display()}
      </header>
    </div>
  );
}

export default App;