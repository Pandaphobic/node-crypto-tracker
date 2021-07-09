var fetch = require("node-fetch")
var chalk = require("chalk")
const fs = require("fs")
const toml = require("toml")
require("dotenv").config()

const config = toml.parse(fs.readFileSync("./config.toml", "utf-8"))

// ** Everything below can be referenced globally and is updated at app start **
// -- GLOBAL API DATA -- //
var allCoinsList = async () => {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/coins/list?include_platform=true")
    const data = await res.json()
    return data
  } catch (err) {
    console.log(err)
    return err
  }
}
// let allCoinsList = `` // id, symbol etc
let coinPrices = `` // price in vs_currency for each coin in config
let gasPrice = ``

// Import Modules
const { aaveHealthFactor } = require("./modules/aavehealthfactor.js")
const { ticker } = require("./modules/ticker")

// Config + Imported From Config
const WIDTH = 32
const COINS_TO_GET = config.ticker.coins.join("%2C")

const VS_CURRENCY = config.ticker.vsCurrency.toLowerCase()
const REFRESH_RATE = config.ticker.refreshRate // in Seconds

// API CALL FOR COINS + PRICES + 24HRCHANGE
const updateCoinPrices = async () => {
  // FINAL URL for FETCH
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${COINS_TO_GET}&vs_currencies=${VS_CURRENCY}&include_24hr_change=true&include_last_updated_at=true`

  try {
    const res = await fetch(url)
    coinPrices = await res.json()
    return coinPrices
  } catch (err) {
    console.log(err) //can be console.error
    return err
  }
}
// API CALL FOR GASPRICE
const updateGasPrice = async () => {
  try {
    const res = await fetch(`https://ethgasstation.info/api/ethgasAPI.json?api-key=${process.env.ETH_GAS_API_KEY}`)
    const data = await res.json()

    return data
  } catch (err) {
    console.log(err)
    return err
  }
}

const separator = char => {
  const arr = new Array(WIDTH).fill(char)
  console.log(arr.join(""))
}

// Main API Call
const main = (async () => {
  // API CALLS
  allCoinsList = await allCoinsList()
  coinPrices = await updateCoinPrices()
  gasPrice = await updateGasPrice()

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
})()

// SET HOW MANY SECONDS BETWEEN REFRESHES
var seconds = REFRESH_RATE
var interval = seconds * 1000
setInterval(function () {
  main()
}, interval)
