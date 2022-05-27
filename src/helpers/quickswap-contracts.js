import ADDRESSES from '../data/contracts-addresses'
import { ethers } from "ethers"
import ERC20Json from '../data/IUniswapV2ERC20.json'
import IUniswapV2Router02Json from '../data/IUniswapV2Router02.json'
import IUniswapV2FactoryJson from '../data/IUniswapV2Factory.json'
import IUniswapV2PairJson from '../data/IUniswapV2Pair.json'

export const QUICKSWAP = {
    router: () => new ethers.Contract(
        ADDRESSES.QuickswapRouter,
        IUniswapV2Router02Json.abi,
        (new ethers.providers.Web3Provider(window.ethereum, 'any')).getSigner()
    ),
    factory: () => new ethers.Contract(
        ADDRESSES.QuickswapFactory,
        IUniswapV2FactoryJson.abi,
        (new ethers.providers.Web3Provider(window.ethereum, 'any')).getSigner()
    ),
    pair: (addr) => new ethers.Contract(
        addr,
        IUniswapV2PairJson.abi,
        (new ethers.providers.Web3Provider(window.ethereum, 'any')).getSigner()
    ),
    token: (addr) => new ethers.Contract(
        addr,
        ERC20Json.abi,
        (new ethers.providers.Web3Provider(window.ethereum, 'any')).getSigner()
    ), 
}

export default QUICKSWAP