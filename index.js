const fetch = require("node-fetch");
const chalk = require("chalk");
const config = require("./config.json");

// INSTATIATE LIST OF COINS TO FETCH
const coinsToGet = config.coins.join("%2C");
const allCoins = config.allCoins;

// SET YOUR PREFERRED CURRENCY HERE
const VS_CURRENCY = config.vsCurrency.toLowerCase();
const REFRESH_RATE = config.refreshRate; // in Seconds

// Find Symbol from master list
const findCoinById = id => {
  const [key, coin] = Object.entries(allCoins).find(
    ([key, coin]) => coin.id === id
  );
  return coin;
};

const separator = char => {
  const arr = new Array(31).fill(char);
  console.log(arr.join(""));
};

const updatePrices = async () => {
  // FINAL URL for FETCH
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinsToGet}&vs_currencies=${VS_CURRENCY}&include_24hr_change=true&include_last_updated_at=true`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err.message); //can be console.error
    return err.message;
  }
};

const defiDashboard = async data => {
  console.log(`${chalk.bold(`      ✨ Defi Dashboard ✨`)}`);
  aaveHealthFactor(data);
};

const aaveHealthFactor = data => {
  // Externals
  const wethPrice = data.weth[VS_CURRENCY];
  const currency = VS_CURRENCY.toUpperCase();

  // Collateral
  const collateralInEth = config.aave.collateralInEth; // TO BE SET IN CONFIG
  const collateralInCurrency = (collateralInEth * wethPrice).toFixed(2);

  // Borrowed
  const borrowedInUSD = config.aave.borrowedInUsd;
  const borrowedInEth = borrowedInUSD / wethPrice;
  // const borrowedInCurrency = (borrowedInEth * wethPrice).toFixed(2);

  // Liquidation Threshold set by AAVE - Static
  const LT = 0.825;
  const healthFactor = ((collateralInEth * LT) / borrowedInEth).toFixed(2);

  console.log(
    `${chalk.bold.bgMagenta(`AAVE Health Factor        ~${healthFactor}`)}`
  );
  // console.log(`  Collateral....${collateralInCurrency} ${currency}`);
  // console.log(`  Borrowed.......${borrowedInCurrency} ${currency}`);
};

const ticker = async data => {
  try {
    console.log(
      `🚀${chalk.bold.magentaBright("Welcome to Crypto Tracker!")}🚀`
    );
    separator("*");
    console.log(
      `${chalk.bold.bgBlueBright(`         Crypto Ticker         `)}`
    );

    // Initialize rows
    const rows = [];

    // Gather data for each row
    for (coin in data) {
      const symbol = findCoinById(coin).symbol;
      const price = data[coin][VS_CURRENCY];
      const priceStirng = price.toString(10);
      const change24hr = data[coin][`${VS_CURRENCY}_24h_change`].toFixed(2);

      // Spaces to help align everything

      const row = {
        symbol: symbol,
        name: coin,
        price: `$${price} ${VS_CURRENCY.toUpperCase()}`,
        change24hr: `${change24hr}%`,
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
  separator("*");
  await ticker(data);
  separator("*");
  await defiDashboard(data);
};
// Init
main();

// SET HOW MANY SECONDS BETWEEN REFRESHES
var seconds = REFRESH_RATE;
var interval = seconds * 1000;
setInterval(function () {
  main();
}, interval);
