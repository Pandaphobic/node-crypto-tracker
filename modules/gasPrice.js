/*
  ⛽ ETH Gas Price ⛽

  Built using eth gas station
  api key from ""

*/
var chalk = require("chalk");
require("dotenv").config();
var fetch = require("node-fetch");

async function gasPrice() {
  try {
    const res = await fetch(
      `https://ethgasstation.info/api/ethgasAPI.json?api-key=${process.env.ETH_GAS_API_KEY}`
    );
    const data = await res.json();

    console.log(
      chalk.bgGrey.bold(
        `🔥 Gas Price Avg.            ${`${chalk.whiteBright(
          data.average.toFixed(0)
        )}`} `
      )
    );
    return data;
  } catch (err) {
    console.log(`API CALL FAILED: 01 ${err}`);
    return err;
  }
}

module.exports = { gasPrice };
