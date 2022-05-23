# addLiquidity#

```solidity
function addLiquidity(
  address tokenA,
  address tokenB,
  uint amountADesired,
  uint amountBDesired,
  uint amountAMin,
  uint amountBMin,
  address to,
  uint deadline
) external returns (uint amountA, uint amountB, uint liquidity);
```
- Adds liquidity to an ERC-20⇄ERC-20 pool.

- To cover all possible scenarios, msg.sender should have already given the router an allowance of at least amountADesired/amountBDesired on tokenA/tokenB.
- Always adds assets at the ideal ratio, according to the price when the transaction is executed.
- If a pool for the passed tokens does not exists, one is created automatically, and exactly amountADesired/amountBDesired tokens are added.

Name	Type  
**tokenA**	address	A pool token.  

**tokenB**	address	A pool token.

**amountADesired**	uint	The amount of tokenA to add as liquidity if the B/A price is <= amountBDesired/amountADesired (A depreciates).  

**amountBDesired**	uint	The amount of tokenB to add as liquidity if the A/B price is <= amountADesired/amountBDesired (B depreciates).

**amountAMin**	uint	Bounds the extent to which the B/A price can go up before the transaction reverts. Must be <= amountADesired.

**amountBMin**	uint	Bounds the extent to which the A/B price can go up before the transaction reverts. Must be <= amountBDesired.

**to**	address	Recipient of the liquidity tokens.

**deadline**	uint	Unix timestamp after which the transaction will revert.

**amountA**	uint	The amount of tokenA sent to the pool.

**amountB**	uint	The amount of tokenB sent to the pool.

**liquidity**	uint	The amount of liquidity tokens minted.

# addLiquidityETH#

```solidity
function addLiquidityETH(
  address token,
  uint amountTokenDesired,
  uint amountTokenMin,
  uint amountETHMin,
  address to,
  uint deadline
) external payable returns (uint amountToken, uint amountETH, uint liquidity);
```
- Adds liquidity to an ERC-20⇄WETH pool with ETH.

- To cover all possible scenarios, msg.sender should have already given the router an allowance of at least amountTokenDesired on token.
- Always adds assets at the ideal ratio, according to the price when the transaction is executed.
- msg.value is treated as a amountETHDesired.
- Leftover ETH, if any, is returned to msg.sender.
- If a pool for the passed token and WETH does not exists, one is created automatically, and exactly amountTokenDesired/msg.value tokens are added.

Name	Type	
**token**	address	A pool token.

**amountTokenDesired**	uint	The amount of token to add as liquidity if the WETH/token price is <= msg.value/amountTokenDesired (token depreciates).

**msg.value** (amountETHDesired)	uint	The amount of ETH to add as liquidity if the token/WETH price is <= amountTokenDesired/msg.value (WETH depreciates).

**amountTokenMin**	uint	Bounds the extent to which the WETH/token price can go up before the transaction reverts. Must be <= amountTokenDesired.

**amountETHMin**	uint	Bounds the extent to which the token/WETH price can go up before the transaction reverts. Must be <= msg.value.

**to**	address	Recipient of the liquidity tokens.

**deadline**	uint	Unix timestamp after which the transaction will revert.

**amountToken**	uint	The amount of token sent to the pool.

**amountETH**	uint	The amount of ETH converted to WETH and sent to the pool.

**liquidity**	uint	The amount of liquidity tokens minted.