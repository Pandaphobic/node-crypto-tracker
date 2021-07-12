/*
  Crypto Ticker

*/
var chalk = require("chalk")
// Find Symbol from master list
const findCoinById = (id, allCoinsList) => {
  const [key, coin] = Object.entries(allCoinsList).find(([key, coin]) => coin.id === id)
  return coin
}

function ticker(data, allCoinsList, VS_CURRENCY) {
  console.log(chalk.bold.bgBlueBright(`         Crypto Ticker       USD`))
  const rows = []
  try {
    for (coin in data) {
      // Build the Row
      let symbol = findCoinById(coin, allCoinsList).symbol.toUpperCase()
      let price = `${data[coin][VS_CURRENCY]}`
      let change24hr = `${data[coin][`${VS_CURRENCY}_24h_change`].toFixed(2)}%`

      const row = [symbol, price, change24hr]
      const neg = row[2].includes("-") ? true : false

      // Calculate Spacing
      const a = new Array(8 - row[0].length).fill(" ")
      const space1 = a.join("")
      const b = new Array(neg ? 18 - row[1].length : 19 - row[1].length).fill(" ")
      const space2 = b.join("")

      // Construct each row with styling and spacing
      const processedRow = `${chalk.cyanBright(row[0])}${space1}${chalk.yellow(row[1])}${space2}${neg ? chalk.redBright(row[2]) : chalk.greenBright(row[2])}`
      rows.push(processedRow)
    }
    for (i = 0; i < rows.length; i++) {
      console.log(rows[i])
    }
  } catch (err) {
    console.log(`ticker error: ${err}`)
  }
}

module.exports = { ticker }
