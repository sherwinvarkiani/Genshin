// server/index.js
var data = require('./data.json');

const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

const DataType = {
  Food: 0,
  Enemies: 1,
};

const Quantities = {
  0: 1,
  1: 3,
  2: 5,
  3: 10,
};

app.get("/api", async (req, res) => {
  var bingoCells = new Set();
  while (bingoCells.size < 25) {
    bingoCells.add(getBingoSlot());
  }

  var arr = Array.from(bingoCells);

	res.json({ message: arr });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

function getRandomItem(dataList) {
  let rnd = rng(dataList.length);

  return dataList[rnd];
}

function rng(exclusiveMax) {
  return Math.floor(Math.random() * exclusiveMax);
}

function getBingoSlot() {
  var rnd = rng(getEnumLength(DataType));
  var msg = "Hello from server!"

  var quantity = Quantities[rng(getEnumLength(Quantities))]

  switch(rnd) {
    case DataType.Food:
      msg = `Cook ${quantity} ${getRandomItem(data["food"])}`
      break;
    case DataType.Enemies:
      msg = `Defeat ${quantity} ${getRandomItem(data["enemies"])}`
      break;
  }

  msg += quantity > 1 ? "(s)" : ""; 

  return msg;
}

function getEnumLength(enumName) {
  return Object.keys(enumName).length
}