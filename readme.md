## Node Ticker - Super Simple Node.js Crypto Tracker

<p>Super simple node.js crypto tracker app powered by CoinGecko and Eth Gas Station APIs. Customize the config.toml set the coins you want to see as well as your aave info to see the health factor!</p>

<img src="https://github.com/Pandaphobic/node-crypto-ticker/blob/main/screenshots/example_screenshot.png" 
  alt="Example View">

## Installation & Setup

### Installation

1. Clone the repo `$ gh repo clone Pandaphobic/node-crypto-ticker`
2. cd into the directory `$ cd node-crypto-ticker`
3. Install with `$ npm install`

### Setup

A config.toml file must be present alongside a .env in the root folder. Your .env should contain your Eth Gas Station API Key. You can setup both manually based off the examples, or you can use the configurator

#### Configurator

Launch the configurator with `$ npm run config`

This will allow you to set:

- Coins / Tokens in the Ticker
- Base currency
- Ticker Refresh Rate
- API Key if .env not present already

Modify you API Keys with `$ npm run apikeys`

#### Manual Config

Set your desired coins, currency and refresh rate by adding them to the array in the config.toml file. For AAVE, the three existing entries are the minimum requirement to get health factor. For now, you will need to update these manually.

**config.toml**

```
[ticker]
  coins = ["ethereum","litecoin","bitcoin","weth","usd-coin"]
  vsCurrency = "usd"
  refreshRate = 500

[aave]
  collateralInEth = 5
  borrowedInEth = 4
  borrowedInUsd = 8655
```

**.env**

```
ETH_GAS_API_KEY=paste_your_api_key_here
```

#### API Calls Used

- Coin Gecko Coins [`/coins/list`](https://api.coingecko.com/api/v3/coins/list)
- Eth Gas Price [`ethgasAPI.json?api-key=ETH_GAS_API_KEY`](https://ethgasstation.info/api/ethgasAPI.json?api-key=process.env.ETH_GAS_API_KEY)
- Coin Gecko API [`/api/v3/simple/price?ids=COINS_TO_GET&vs_currencies=VS_CURRENCY&include_24hr_change=true&include_last_updated_at=true`](https://api.coingecko.com/api/v3/simple/price?ids=COINS_TO_GET&vs_currencies=VS_CURRENCY&include_24hr_change=true&include_last_updated_at=true)
