// server/index.js
var data = require('./data.json');

const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origins: ['https://sherwinvarkiani.github.io/Genshin/']
  }
});

// the different types of task the person can be asked to do
const DataType = {
  Food: 0,
  Enemies: 1,
  Items: 2,
  SpiralAbyss: 3,
  TCG: 4,
  Gacha: 5,
  Fishing: 6,
  Domains: 7,
  Miscellaneous: 8
};

// the number of times a person needs to complete a task
const Quantities = {
  0: 1,
  1: 3,
  2: 5,
};

const CellStatus = {
  None: 0,
  Blue: 1,
  Red: 2,
  Both: 3
}

var boards = {}

app.get("/api", async (req, res) => {
  // set to avoid duplicates
  var bingoCells = new Set();
  while (bingoCells.size < 25) {
    bingoCells.add(getBingoSlot());
  }

  // idk how you pass a set so just pass an array instead
  var arr = Array.from(bingoCells);

  res.json({ message: arr });
});


io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("create", (roomName, callback) => {
    // join room
    console.log("create: " + roomName['token']);
    // console.log("the room had " + io.socket.get(roomName['token']).size + " people");
    socket.join(roomName['token']);

    console.log("the new room has " + io.sockets.adapter.rooms.get(roomName['token']).size + " person");

    callback({
      status: "ok123"
    });
  });

  socket.on("join", (roomName, callback) => {
    // join room
    console.log("join: " + roomName['token']);
    console.log("the room had " + io.sockets.adapter.rooms.get(roomName['token']).size + " people");

    if (io.sockets.adapter.rooms.get(roomName['token']).size !== 1) {
      callback({
        status: "error: too many users in room"
      });
      return;
    }

    socket.join(roomName['token']);

    console.log("and now has " + io.sockets.adapter.rooms.get(roomName['token']).size + " people");

    callback({
      status: "ok123"
    });
  });

  socket.on("get board", (roomName, callback) => {
    // generate board for room
    // set to avoid duplicates
    var bingoCells = new Set();
    while (bingoCells.size < 25) {
      bingoCells.add(getBingoSlot());
    }

    var arr = Array.from(bingoCells);
    var cellStatuses = Array(25).fill(CellStatus.None);
    console.log(cellStatuses);
    boards[roomName['token']] = [arr, cellStatuses];
    
    
    console.log("generating board and sending to client " + boards[roomName['token']]);
    console.log("done for room " + roomName['token']);
    console.log(roomName['token']);

    io.in(roomName['token']).emit("message", boards[roomName['token']]);
    callback({
      status: "ok"
    });
  });

  socket.on("status", (message, callback) => {
    console.log(message);
    console.log("status: " + message['newCellStatuses'] + " in " + message['token']);

    boards[message['token']][1] = message['newCellStatuses'];
    // send socket to all in room except sender
    io.in(message['token']).emit("message", boards[message['token']]);
    callback({
      status: "ok"
    });
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// get a random item from the json data list
function getRandomItem(dataList) {
  let rnd = rng(dataList.length);

  return dataList[rnd];
}

// shorten the code you need to write for a random number generator
function rng(exclusiveMax) {
  return Math.floor(Math.random() * exclusiveMax);
}

// randomly selects the bingo msgs
function getBingoSlot() {
  var rnd = rng(getEnumLength(DataType));
  var msg = "Hello from server!"

  var quantity = Quantities[rng(getEnumLength(Quantities))]

  switch (rnd) {
    case DataType.Food:
      msg = `Cook ${quantity} ${getRandomItem(data["Food"])}`
      msg += quantity > 1 ? "(s)" : "";
      break;
    case DataType.Enemies:
      msg = `Defeat ${quantity} ${getRandomItem(data["Enemies"])}`
      msg += quantity > 1 ? "(s)" : "";
      break;
    case DataType.Items:
      msg = `Acquire ${quantity} ${getRandomItem(data["Items"])}`
      msg += quantity > 1 ? "(s)" : "";
      break;
    case DataType.SpiralAbyss:
      msg = `${getRandomItem(data["SpiralAbyss"])}`
      break;
    case DataType.TCG:
      msg = `${getRandomItem(data["TCG"])}`
      break;
    case DataType.Gacha:
      msg = `${getRandomItem(data["Gacha"])}`
      break;
    case DataType.Fishing:
      msg = `Catch ${quantity} ${getRandomItem(data["Fishing"])}`
      msg += quantity > 1 ? "(s)" : "";
      break;
    case DataType.Domains:
      msg = `Complete ${getRandomItem(data["Domains"])}`
      break;
    case DataType.Miscellaneous:
      msg = `${getRandomItem(data["Miscellaneous"])}`
      break;

  }

  return msg;
}

// abstract away getting enum length
function getEnumLength(enumName) {
  return Object.keys(enumName).length
}