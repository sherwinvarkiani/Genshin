import { io } from 'socket.io-client';

let socket;

export const initiateSocketConnection = (token, cb) => {
  socket = io(process.env.REACT_APP_SOCKET_ENDPOINT, {
    // auth: {
    //   token,
    // },
    // transports: [ "websocket" ]
  });
  console.log(`Connecting to room ${token}...`);
};

export const disconnectSocket = () => {
  console.log('Disconnecting socket...');
  if (socket) socket.disconnect();
}

export const joinRoom = (token, cb) => {
  if (!socket) return(true);

  socket.emit('join', token, cb);
}

export const getBoard = (token, cb) => {
  if (!socket) return(true);

  console.log("room number is " + token);
  socket.emit('get board', token, cb);
}

// Handle message receive event
export const subscribeToMessages = (cb) => {
  if (!socket) return(true);
  socket.on('message', msg => {
    console.log('Room event received!');
    return cb(null, msg);
  });
}

export const updateStatus = (message, cb) => {
  if (socket) socket.emit('status', message, cb);
}