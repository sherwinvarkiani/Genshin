// server/index.js
var data = require('./data.json');

const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

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
  // Collect Items
  // Spiral Abyss
  // TCG
  // Gacha -> get The Bell or get a 5 star or get a non-banner character
  // Fishing
  // Domains
  // Miscellaneous (i.e. walk between x teleporters, walk between 2 statue of the sevens (2 different regions), die to fall damage, drowning, (die in 5 different ways), beat cryo regisvine with a mono cryo team, take a picture of x animals, shoot a bird while in middair)
};

// the number of times a person needs to complete a task
const Quantities = {
  0: 1,
  1: 3,
  2: 5,
  3: 10,
};

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

app.get("/createRoom", async (req, res) => {

  res.json({ message: "" });
});

app.listen(PORT, () => {
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

  // TODO scale the rng so that its scaled based off of how many options are in the data set
  // i.e. right now you're almost always guaranteed to get the tcg one
  switch (rnd) {
    case DataType.Food:
      msg = `Cook ${quantity} ${getRandomItem(data["food"])}`
      msg += quantity > 1 ? "(s)" : "";
      break;
    case DataType.Enemies:
      msg = `Defeat ${quantity} ${getRandomItem(data["enemies"])}`
      msg += quantity > 1 ? "(s)" : "";
      break;
    case DataType.Items:
      msg = `Acquire ${quantity} ${getRandomItem(data["items"])}`
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