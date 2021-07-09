var fetch = require("node-fetch")
var chalk = require("chalk")
var config = require("./config.json")

// ** Everything below can be referenced globally and is updated at app start **
// -- GLOBAL API DATA -- //
let allCoinsList = `` // id, symbol etc
let coinPrices = `` // price in vs_currency for each coin in config
let gasPrice = ``

// Import Modules
// const { aaveHealthFactor } = require("./modules/aavehealthfactor")
const { aaveHealthFactor } = require("./modules/aavehealthfactor.js")

// Config + Imported From Config
const coinsToGet = ["ethereum", "matic-network", "litecoin", "bitcoin", "weth", "celsius-degree-token", "usd-coin"].join("%2C")
const WIDTH = 32
const VS_CURRENCY = config.vsCurrency.toLowerCase()
const REFRESH_RATE = config.refreshRate // in Seconds

// Find Symbol from master list
const findCoinById = id => {
  const [key, coin] = Object.entries(allCoinsList).find(([key, coin]) => coin.id === id)
  return coin
}

const separator = char => {
  const arr = new Array(WIDTH).fill(char)
  console.log(arr.join(""))
}

const getCoinsList = async () => {
  const url = "https://api.coingecko.com/api/v3/coins/list?include_platform=true"

  try {
    const res = await fetch(url)

    allCoinsList = await res.json()
    return allCoinsList
  } catch (err) {
    console.log(err)
    return err
  }
}

const updatePrices = async () => {
  // FINAL URL for FETCH
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinsToGet}&vs_currencies=${VS_CURRENCY}&include_24hr_change=true&include_last_updated_at=true`

  try {
    const res = await fetch(url)
    coinPrices = await res.json()
    return coinPrices
  } catch (err) {
    console.log(err) //can be console.error
    return err
  }
}

const defiDashboard = async data => {
  console.log(`${chalk.bold(`      ✨ Defi Dashboard ✨`)}`)
  separator("-")
}

const ticker2 = data => {
  try {
    console.log(chalk.bold.bgBlueBright(`         Crypto Ticker       USD`))
    const rows = []

    for (coin in data) {
      // const row = ["LTC", "$136.75 USD", "-0.00"];
      const symbol = `${`${findCoinById(coin).symbol}`.toUpperCase()}:`
      const price = `${data[coin][VS_CURRENCY]}`
      const change24hr = `${data[coin][`${VS_CURRENCY}_24h_change`].toFixed(2)}%`

      const row = [symbol, price, change24hr, symbol.length, price.length, change24hr.length]
      rows.push(row)
    }
    console.log(rows)

    // console.log(data);
  } catch (err) {
    console.log(`ticker2 error: ${err}`)
  }
}

const ticker = data => {
  try {
    console.log(chalk.bold.bgBlueBright(`         Crypto Ticker          `))

    // Initialize rows
    const rows = []
    // Gather data for each row
    for (coin in data) {
      const symbol = findCoinById(coin).symbol
      const price = data[coin][VS_CURRENCY]
      const priceStirng = price.toString(10)
      const change24hr = data[coin][`${VS_CURRENCY}_24h_change`].toFixed(2)

      const row = {
        symbol: symbol,
        name: coin,
        price: `$${price} ${VS_CURRENCY.toUpperCase()}`,
        change24hr: `${change24hr}%`
      }

      rows.push(row)
    }
    // Build, style and align each row
    for (i = 0; i < rows.length; i++) {
      const change24hr = rows[i].change24hr
      // Output: SYMBOL: $PRICE 24HR_CHANGE
      const row = `${chalk.bold.cyanBright(rows[i].symbol.toUpperCase())}: ${chalk.bold.yellowBright(rows[i].price)}  ${change24hr.includes("-") ? chalk.bold.redBright(rows[i].change24hr) : chalk.bold.greenBright(rows[i].change24hr)}`
      // print the row to the console
      console.log(row)
    }
  } catch (err) {
    console.log(err.message) //can be console.error
  }
}

const updateGasPrice = async () => {
  try {
    const res = await fetch("https://ethgasstation.info/api/ethgasAPI.json?api-key=d8a083cf3f605644c2b7d64a3361c76f92a210db4f41bf091d43fb785734")
    const data = await res.json()

    return data
  } catch (err) {
    console.log(err)
    return err
  }
}

// Main API Call
const main = async () => {
  // API CALLS
  allCoinsList = await getCoinsList()
  coinPrices = await updatePrices()
  gasPrice = await updateGasPrice()

  // START OF DRAW
  console.clear()
  separator("-")
  console.log(`🚀 ${chalk.bold.magentaBright("Welcome to Crypto Tracker!")} 🚀`)
  separator("-")
  // ticker2(data);
  ticker(coinPrices)
  separator("-")
  defiDashboard()
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
