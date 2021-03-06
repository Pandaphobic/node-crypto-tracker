#!/usr/bin/env node
const commander = require("commander");
const TOML = require("@iarna/toml");
const fs = require("fs");
const path = require("path");
const program = new commander.Command();
const { prompt } = require("enquirer");

// DECALRE ACCEPTED CLI ARGS
program
  .option("-c, --config", "launch configurator")
  .option("-api, --api-keys", "launch API Key setup")
  .option("-ac, --add-coins", "add coins to your config file")
  .option("-cc, --change-currency", "change ticker base currency");

// Create and Modify the config.toml
async function updateConfig(response) {
  let currentConfig = new Object();
  try {
    currentConfig = TOML.parse(
      fs.readFileSync(path.resolve(__dirname, "../config.toml"))
    );
  } catch (err) {
    currentConfig = currentConfig = TOML.parse(
      // default on fail
      fs.readFileSync(
        path.resolve(__dirname, "../examples/config_example.toml")
      )
    );
  }

  // Apply Changes to Current Config
  currentConfig.ticker.coins = response.coins;
  currentConfig.ticker.vsCurrency = response.vsCurrency;
  currentConfig.ticker.refreshRate = response.refreshRate;

  // Save Changes to config.toml
  let newConfig = TOML.stringify(currentConfig);
  fs.writeFile(path.resolve(__dirname, "../config.toml"), newConfig, err => {
    if (err) return console.log(err);
  });
}

// Create and Update .env file
async function updateApiKeys(response) {
  let newDotEnv = `ETH_GAS_API_KEY=${response.ETH_GAS_API_KEY}`;
  fs.writeFile(path.resolve(__dirname, "../.env"), newDotEnv, err => {
    if (err) return console.log(err);
    console.log("API Key Saved!");
  });
}

// QUESTIONS ASKED BY CONFIFURATOR
const tickerPrompts = [
  {
    type: "list",
    name: "coins",
    message: "Coins? (comma separated IDs)",
  },
  {
    type: "Input",
    name: "vsCurrency",
    message: "Currency?",
  },
  {
    type: "Numeral",
    name: "refreshRate",
    message: "Refresh rate? (> 15)",
  },
];
// QUESTIONS ASKED BY API SETUP
const apiPrompts = [
  {
    type: "Input",
    name: "ETH_GAS_API_KEY",
    message: "Enter your Eth Gas Station API Key: ",
  },
];

// PARSE ARGS FROM CLI
program.parse(process.argv);
const options = program.opts();

// Set actions for each ARG
if (options.config) configurator();
if (options.apiKeys) apiKeyCofig();
if (options.addCoins) addCoins();
if (options.changeCurrency) changeCurrency();

async function configurator() {
  try {
    const response = await prompt(tickerPrompts);
    updateConfig(response);
  } catch (err) {
    console.log(err);
  }

  try {
    fs.readFileSync(path.resolve(__dirname, "../.env"));
  } catch (err) {
    apiKeyCofig();
  }
}

async function apiKeyCofig() {
  try {
    const response = await prompt(apiPrompts);
    updateApiKeys(response);
  } catch (err) {
    console.log(err);
  }
}

async function changeCurrency() {
  try {
    const response = await prompt({
      type: "input",
      name: "currency",
      message: "Ticker Currency: ",
    });

    currentConfig = TOML.parse(
      fs.readFileSync(path.resolve(__dirname, "../config.toml"))
    );
    currentConfig.ticker.vsCurrency = response.currency;

    let newConfig = TOML.stringify(currentConfig);
    fs.writeFile(path.resolve(__dirname, "../config.toml"), newConfig, err => {
      if (err) return console.log(err);
    });
  } catch {
    console.log("config.toml File can't be opened.");
  }
}

async function addCoins() {
  try {
    const response = await prompt({
      type: "List",
      name: "coins",
      message: "Coins to add: ",
    });

    currentConfig = TOML.parse(
      fs.readFileSync(path.resolve(__dirname, "../config.toml"))
    );
    let coins = await response.coins;

    for (coin in coins) {
      currentConfig.ticker.coins.push(coins[coin]);
    }

    console.log(currentConfig.ticker.coins);
    let newConfig = TOML.stringify(currentConfig);
    fs.writeFile(path.resolve(__dirname, "../config.toml"), newConfig, err => {
      if (err) return console.log(err);
    });
  } catch {
    console.log("config.toml File can't be opened.");
  }
}
