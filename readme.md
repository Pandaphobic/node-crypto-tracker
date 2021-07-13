## Node Ticker - Super Simple Node.js Crypto Tracker

<p align="left">Super simple node.js crypto tracker app powered by CoinGecko and Eth Gas Station APIs. Customize the config.toml set the coins you want to see as well as your aave info to see the health factor!</p>

<p align="right">
<img src="https://github.com/Pandaphobic/node-crypto-ticker/blob/main/screenshots/example_screenshot.png" 
  alt="Example View" 
  width="292" height="305">
</p>

## Installation & Config

#### Installation

1. Clone the repo `gh repo clone Pandaphobic/node-crypto-ticker`
2. cd into the directory `$ cd node-crypto-ticker`
3. Install with `$ npm install`

#### Config

Set your desired coins, currency and refresh rate by adding them to the array in the config.toml file. For AAVE, the three existing entries are the minimum requirement to get health factor. For now, you will need to update these manually.

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

#### API Calls Used

- Coin Gecko Coins [`/coins/list`](https://api.coingecko.com/api/v3/coins/list)
- Eth Gas Price [`ethgasAPI.json?api-key=ETH_GAS_API_KEY`](https://ethgasstation.info/api/ethgasAPI.json?api-key=process.env.ETH_GAS_API_KEY)
- Coin Gecko API [`/api/v3/simple/price?ids=COINS_TO_GET&vs_currencies=VS_CURRENCY&include_24hr_change=true&include_last_updated_at=true`](https://api.coingecko.com/api/v3/simple/price?ids=COINS_TO_GET&vs_currencies=VS_CURRENCY&include_24hr_change=true&include_last_updated_at=true)
