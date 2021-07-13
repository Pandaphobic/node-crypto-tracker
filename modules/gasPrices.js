var chalk = require("chalk")
function printGasPrice(gasPrices) {
  const message = "🔥 Gas Price Avg."
  const numOfSpaces = 32 - message.length - (gasPrices.average / 10).toFixed(0).length - 1

  const a = new Array(numOfSpaces).fill(" ")
  const spaces = a.join("")

  console.log(chalk.bgGrey.bold(`${message}${spaces}${`${chalk.whiteBright((gasPrices.average / 10).toFixed(0))}`} `))
}

module.exports = { printGasPrice }
