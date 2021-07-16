var fetch = require("node-fetch")
var chalk = require("chalk")
const fs = require("fs")
const TOML = require("@iarna/toml")
require("dotenv").config()

// Config + Imported From Config
const config = TOML.parse(fs.readFileSync("./config.toml", "utf-8"))
const WIDTH = 32
const COINS_TO_GET = config.ticker.coins.join("%2C")
const VS_CURRENCY = config.ticker.vsCurrency.toLowerCase()
const REFRESH_RATE = config.ticker.refreshRate // in Seconds

// ***** IMPORT MODULES *****
const { aaveHealthFactor } = require("./modules/aavehealthfactor.js")
const { ticker } = require("./modules/ticker")
const { printGasPrice } = require("./modules/gasPrices")

// Separator Module
const separator = char => {
  const arr = new Array(WIDTH).fill(char)
  console.log(arr.join(""))
}

// ***** API CALLS  *****
const getAllCoinsList = async () => {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/coins/list?include_platform=true")
    const coinsList = await res.json()
    return coinsList
  } catch (err) {
    console.log(`LIST CALL FAILED: 03 ${err}`)
  }
}

const getCoinPrices = async () => {
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${COINS_TO_GET}&vs_currencies=${VS_CURRENCY}&include_24hr_change=true&include_last_updated_at=true`)
    const coinPrices = await res.json()
    return coinPrices
  } catch (err) {
    console.log(`PRICE CALL FAILED: 02 ${err}`)
  }
}

const getGasPrice = async () => {
  try {
    const res = await fetch(`https://ethgasstation.info/api/ethgasAPI.json?api-key=${process.env.ETH_GAS_API_KEY}`)
    const gasPrices = await res.json()
    return gasPrices
  } catch (err) {
    console.log(`GAS CALL FAILED: 01 ${err}`)
  }
}

async function main() {
  // UPDATE DATA
  if (!allCoinsList) {
    var allCoinsList = await getAllCoinsList() // IDs, names, details of coins
  }
  var coinPrices = await getCoinPrices() // price in vs_currency for each coin in config
  var gasPrices = await getGasPrice() // get avgerage gas price in gwei
  // START OF DRAW
  console.clear()
  separator("-")
  console.log(`🚀 ${chalk.bold.magentaBright("Welcome to Crypto Tracker!")} 🚀`)
  separator("-")
  ticker(coinPrices, allCoinsList, VS_CURRENCY)
  separator("-")
  console.log(`${chalk.bold(chalk.bgWhite.black(`      ✨ DeFi Dashboard ✨      `))}`)
  separator("-")
  printGasPrice(gasPrices)
  aaveHealthFactor()
}
// Init
main()

// SET HOW MANY SECONDS BETWEEN REFRESHES
var seconds = REFRESH_RATE
var interval = seconds * 1000
setInterval(function () {
  main()
}, interval)
