const fetch = require("node-fetch");
const chalk = require("chalk");
const config = require("./config.json");

// INSTATIATE LIST OF COINS TO FETCH
const coinsList = config.coins;
const coinsToGet = coinsList.join("%2C");
const allCoins = config.allCoins;

// SET YOUR PREFERRED CURRENCY HERE
const VS_CURRENCY = config.vsCurrency.toLowerCase();
const REFRESH_RATE = config.refreshRate; // in Seconds

// FINAL URL for FETCH
const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinsToGet}&vs_currencies=${VS_CURRENCY}&include_24hr_change=true&include_last_updated_at=true`;

// Find Symbol from master list
const findCoinById = id => {
  const [key, coin] = Object.entries(allCoins).find(
    ([key, coin]) => coin.id === id
  );
  return coin;
};

const separator = async () => {
  console.log(">----------------------------<");
};

const updatePrices = async () => {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err.message); //can be console.error
    return err.message;
  }
};

const healthFactor = async data => {
  const wethPrice = data.weth[VS_CURRENCY];
  const collateralInEth = config.aave.collateralInEth; // TO BE SET IN CONFIG
  const collateralInCurrency = (collateralInEth * wethPrice).toFixed(2);
  const borrowedInEth = config.aave.borrowedInEth;
  const borrowedInCurrency = (borrowedInEth * wethPrice).toFixed(2);
  const LT = 0.825;
  const healthFactor = ((collateralInEth * LT) / borrowedInEth).toFixed(2);
  const currency = VS_CURRENCY.toUpperCase();

  console.log(`  AAVE Health Factor - ${healthFactor}`);
  console.log(`  Collateral....${collateralInCurrency} ${currency}`);
  console.log(`  Borrowed.......${borrowedInCurrency} ${currency}`);
};

const ticker = async data => {
  try {
    console.log(`🚀 ${chalk.bold.magentaBright("Welcome to Node Ticker!")} 🚀`);
    separator();

    // Initialize rows
    const rows = [];

    // Gather data for each row
    for (coin in data) {
      const symbol = findCoinById(coin).symbol;
      const price = data[coin][VS_CURRENCY];
      const priceStirng = price.toString(10);
      const change24hr = data[coin][`${VS_CURRENCY}_24h_change`].toFixed(2);

      // Spaces to help align everything
      var a = Array(6 - symbol.length)
        .fill("\xa0")
        .join("");
      var b = Array(9 - priceStirng.length)
        .fill("\xa0")
        .join("");
      var c = Array(8 - priceStirng.length)
        .fill("\xa0")
        .join("");

      const row = {
        symbol: symbol,
        name: coin,
        price: `${a}$${price} ${VS_CURRENCY.toUpperCase()}`,
        change24hr: `${change24hr.includes("-") ? c : b}${change24hr}%`,
      };
      rows.push(row);
    }
    // Build, style and align each row
    for (i = 0; i < rows.length; i++) {
      const change24hr = rows[i].change24hr;
      // Output: SYMBOL: $PRICE 24HR_CHANGE
      const row = `${chalk.bold.cyanBright(
        rows[i].symbol.toUpperCase()
      )}: ${chalk.bold.yellowBright(rows[i].price)}  ${
        change24hr.includes("-")
          ? chalk.bold.redBright(rows[i].change24hr)
          : chalk.bold.greenBright(rows[i].change24hr)
      }`;
      // print the row to the console
      console.log(row);
    }
  } catch (err) {
    console.log(err.message); //can be console.error
  }
};

// Main API Call
const main = async () => {
  const data = await updatePrices();
  console.clear();
  await ticker(data);
  await separator();
  await healthFactor(data);
};
// Init
main();

// SET HOW MANY SECONDS BETWEEN REFRESHES
var seconds = REFRESH_RATE;
var interval = seconds * 1000;
setInterval(function () {
  main();
}, interval);
