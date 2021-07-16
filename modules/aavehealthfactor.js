/*
  👻 AAVE Health Factor Module 👻
  
  (CollatConvertedToEth * 82.5%) / TotalBorrowed In ETH

  More information: https://docs.aave.com/risk/asset-risk/risk-parameters#health-factor

*/
var chalk = require("chalk")
const fetch = require("node-fetch")
const fs = require("fs")
const TOML = require("@iarna/toml")
const path = require("path")

const config = TOML.parse(fs.readFileSync(path.resolve(__dirname, "../config.toml"), "utf-8"))

async function aaveHealthFactor() {
  const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=weth&vs_currencies=usd")
  const data = await res.json()

  // Externals
  const wethPriceUsd = await data.weth.usd

  // Collateral
  const collateralInEth = config.aave.collateralInEth // TO BE SET IN CONFIG
  // const collateralInCurrency = (collateralInEth * wethPrice).toFixed(2);

  // Borrowed
  const borrowedInUSD = config.aave.borrowedInUsd
  const borrowedInEth = borrowedInUSD / wethPriceUsd
  // const borrowedInCurrency = (borrowedInEth * wethPrice).toFixed(2);

  // Liquidation Threshold set by AAVE - Static
  const LT = 0.825
  const healthFactor = ((collateralInEth * LT) / borrowedInEth).toFixed(2)
  console.log(`${chalk.bold.bgMagenta(`👻 AAVE Health Factor     ~${healthFactor} `)}`)
}

module.exports = { aaveHealthFactor }
