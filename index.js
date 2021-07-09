var fetch = require("node-fetch")
var chalk = require("chalk")
const fs = require("fs")
const toml = require("toml")
require("dotenv").config()

let allCoinsList = ""
let coinPrices = ""
let gasPrice = ""

// Config + Imported From Config
const config = toml.parse(fs.readFileSync("./config.toml", "utf-8"))
const WIDTH = 32
const COINS_TO_GET = config.ticker.coins.join("%2C")
const VS_CURRENCY = config.ticker.vsCurrency.toLowerCase()
const REFRESH_RATE = config.ticker.refreshRate // in Seconds

async function updateGasPrice() {
  try {
    const res = await fetch(`https://ethgasstation.info/api/ethgasAPI.json?api-key=${process.env.ETH_GAS_API_KEY}`)
    const data = await res.json()
    return data
  } catch (err) {
    console.log(err)
    return err
  }
}

async function updateCoinPrices() {
  // FINAL URL for FETCH
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${COINS_TO_GET}&vs_currencies=${VS_CURRENCY}&include_24hr_change=true&include_last_updated_at=true`

  const res = await fetch(url)
  const data = await res.json()
  return data
}

async function getAllCoins() {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/coins/list?include_platform=true")
    const data = await res.json()
    allCoinsList = data
    return data
  } catch (err) {
    console.log(err)
  }
}

// Import Modules
const { aaveHealthFactor } = require("./modules/aavehealthfactor.js")
const { ticker } = require("./modules/ticker")

const separator = char => {
  const arr = new Array(WIDTH).fill(char)
  console.log(arr.join(""))
}

// Main API Call
async function main() {
  // API CALLS
  if (!allCoinsList) {
    allCoinsList = await getAllCoins() // id, symbol etc
  }
  coinPrices = await updateCoinPrices() // price in vs_currency for each coin in config
  gasPrice = await updateGasPrice() // get avgerage gas price in gwei

  // START OF DRAW
  console.clear()
  separator("-")
  console.log(`🚀 ${chalk.bold.magentaBright("Welcome to Crypto Tracker!")} 🚀`)
  separator("-")
  await ticker(coinPrices, allCoinsList, VS_CURRENCY)
  separator("-")
  console.log(`${chalk.bold(chalk.bgWhite.black(`      ✨ DeFi Dashboard ✨      `))}`)
  separator("-")
  console.log(chalk.bgGrey.bold(`🔥 Gas Price Avg.           ${`${chalk.whiteBright(gasPrice.average)}`} `))
  aaveHealthFactor(coinPrices, VS_CURRENCY, config)
}
// Init
main()

// SET HOW MANY SECONDS BETWEEN REFRESHES
var seconds = REFRESH_RATE
var interval = seconds * 1000
setInterval(function () {
  main()
}, interval)
