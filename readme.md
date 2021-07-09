## Node Ticker - Super Simple Node.js Crypto Tracker

Super simple node.js crypto tracker app powered by CoinGecko and Eth Gas Station APIs. Customize the config.toml set the coins you want to see as well as your aave info to see the health factor!

<p align="center">
<img src="https://github.com/Pandaphobic/node-crypto-ticker/blob/main/screenshots/example_screenshot.png" 
  alt="Example View" 
  width="292" height="305">
</p>

## Installation & Config

#### Installation

1. Clone the repo +`gh repo clone Pandaphobic/node-crypto-ticker`
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

#### All Coins?

The list of coins at the bottom is used to get metadata about coins. Rather than requesting the list for each coin, it is included once and referenced. Feel free to update the list if you can't find your coin in it. The list comes from the Coin Gecko API [`/coins/list`](https://api.coingecko.com/api/v3/coins/list)
