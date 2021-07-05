const express = require("express");
const app = express();
const dotenv = require("dotenv");
const fetch = require("node-fetch");
const allCoins = require("./allCoins.json");
const chalk = require("chalk");

// LIST OF COINS TO FETCH
const coinsList = [
  "ethereum",
  "matic-network",
  "litecoin",
  "bitcoin",
  "weth",
  "tether",
  "sushi",
];
// PARAMS
const coinsToGet = coinsList.join("%2C");
const vsCurrency = "cad";

// FINAL URL for FETCH
const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinsToGet}&vs_currencies=${vsCurrency}&include_24hr_change=true&include_last_updated_at=true`;

// Utils
const findCoinById = id => {
  const [key, coin] = Object.entries(allCoins).find(
    ([key, coin]) => coin.id === id
  );
  return coin;
};

// Main API Call
const main = async () => {
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.clear();
    console.log(`🚀 ${chalk.bold.blue("Welcome to Node Ticker!")} 🚀`);
    console.log();

    // Initialize rows
    const rows = [];

    // Gather data for each row
    for (coin in data) {
      const symbol = findCoinById(coin).symbol;
      const price = data[coin].cad;
      const priceStirng = price.toString(10);
      const change24hr = data[coin].cad_24h_change.toFixed(2);

      // Spaces to help align everything
      var a = Array(6 - symbol.length)
        .fill("\xa0")
        .join("");
      var b = Array(8 - priceStirng.length)
        .fill("\xa0")
        .join("");
      var c = Array(7 - priceStirng.length)
        .fill("\xa0")
        .join("");

      const row = {
        symbol: symbol,
        name: coin,
        price: `${a}$${price} CAD`,
        change24hr: `${change24hr.includes("-") ? c : b}${change24hr}%`,
      };
      rows.push(row);
    }
    // Build, style and align each row
    for (i = 0; i < rows.length; i++) {
      const change24hr = rows[i].change24hr;
      const row = `${chalk.bold.yellow(
        rows[i].symbol.toUpperCase()
      )}: ${chalk.bold(rows[i].price)} | ${
        change24hr.includes("-")
          ? chalk.bold.red(rows[i].change24hr)
          : chalk.bold.green(rows[i].change24hr)
      }`;
      // print the row to the console
      console.log(row);
    }
  } catch (err) {
    console.log(err.message); //can be console.error
  }
};

// Initial Run
main();

// SET HOW MANY SECONDS BETWEEN REFRESHES
var seconds = 5,
  the_interval = seconds * 1000;
setInterval(function () {
  main();
}, the_interval);

app.listen(3011, () => {
  console.clear();
  console.log(`🚀 ${chalk.bold.blue("Welcome to Node Ticker!")} 🚀`);
  console.log();
});
