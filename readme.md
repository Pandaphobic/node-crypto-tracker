## Node Ticker - Super Simple Node.js Crypto Ticker

Super simple node.js crypto ticker app made with Express.js and powered by the CoinGecko API. Customize the coinsList array in index.js to see the symbol, price and 24hr change for each coin in the list.

<p align="center">
<img src="https://github.com/Pandaphobic/node-crypto-ticker/blob/main/screenshots/example_screenshot.png" 
  alt="Example View" 
  width="360" height="310">
</p>

## Installation & Config

#### Installation:

1. Clone the repo +`gh repo clone Pandaphobic/node-crypto-ticker`
2. - `$ cd node-crypto-ticker`
3. Install with `npm`
   - `$ npm install`

#### Config

Set your desired coins, currency and refresh rate by adding them to the array in the config.json file

```
  "coins": [
    "ethereum",
    "matic-network",
    "litecoin",
    "bitcoin",
    "weth",
    "celsius-degree-token",
    "usdc"
  ],
  "vsCurrency": "cad",
  "refreshRate": 5,
```

#### All Coins?

The list of coins at the bottom is used to get metadata about coins. Rather than requesting the list for each coin, it is included once and referenced. Feel free to update the list if you can't find your coin in it. The list comes from the Coin Gecko API [`/coins/list`](https://api.coingecko.com/api/v3/coins/list)
