# Front-End Challenge

You are asked to implement a mini liquidity provision dapp. The dapp should communicate with Quickswap (uniswap fork) contracts directly on **Polygon** network.

**Supported Assets:**

- WMATIC
- WETH
- WBTC
- USDC

## Figma

[https://www.figma.com/embed?embed_host=notion&url=https%3A%2F%2Fwww.figma.com%2Ffile%2Fz2JbgovWE4r8PykS5bN1m6%2FUntitled%3Fnode-id%3D0%253A1](https://www.figma.com/embed?embed_host=notion&url=https%3A%2F%2Fwww.figma.com%2Ffile%2Fz2JbgovWE4r8PykS5bN1m6%2FUntitled%3Fnode-id%3D0%253A1)

## Solution requirements:

- The dapp should be written in React.js
- The dapp should handle the loading states for any async request/operation
- The dapp should validate the inputs correctly (eg: user can’t click supply if he doesn’t have enough balance of 1 of the assets)

To implement solution efficiently, you will need to do the following operations:

- Call addLiquidity function properly to supply liquidity to the selected pair of assets
- Get the connected wallet balances for every supported asset

## Recommendations

- It’s strongly recommended to read uniswap protocol documentation to understand how the functions work. [https://docs.uniswap.org/](https://docs.uniswap.org/)
- It’s recommended to play around with quickswap and uniswap to see how this feature works. Our challenge should be a mini version of that

**Polygon Addresses you will need:**

| WMATIC | 0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270 |
| --- | --- |
| WETH | 0x7ceb23fd6bc0add59e62ac25578270cff1b9f619 |
| WBTC | 0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6 |
| USDC | 0x2791bca1f2de4661ed88a30c99a7a9449aa84174 |
| QuickswapRouter | 0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff |
| QuickswapFactory | 0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32 |

# Submission

- Your submission should be a github repo and a deployed copy on vercel or netlify

Good luck