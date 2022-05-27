import { BehaviorSubject } from "rxjs"
import { ethers } from "ethers"
import SUPPORTED_ASSETS, { asText } from "../data/supported-assets"
import ADDRESSES from '../data/contracts-addresses'
import ERC20Json from '../data/IUniswapV2ERC20.json'
import IUniswapV2Router02Json from '../data/IUniswapV2Router02.json'
// import IUniswapV2FactoryJson from '../data/IUniswapV2Factory.json'
// import IUniswapV2PairJson from '../data/IUniswapV2Pair.json'
import QUICKSWAP from "../helpers/quickswap-contracts"

const DEFAULT_STATE = {
    _name: "swapAssetsForm",
    web3Payload: {
        tokenA: ADDRESSES[SUPPORTED_ASSETS.WMATIC],
        tokenB: ADDRESSES[SUPPORTED_ASSETS.WETH],
        amountADesired: 0,
        amountBDesired: 0,
        amountAMin: 0,
        amountBMin: 0,
        to: void 0
    },
    formValues: {
        tokenA: SUPPORTED_ASSETS.WMATIC,
        tokenB: SUPPORTED_ASSETS.WETH,
        amountADesired: 0,
        amountBDesired: 0,
    },
    validateAsset: ()=>{},
    validateForm: ()=>{},
    // rates: {},
    warning: void 0,
    error: void 0,
    success: void 0,
    busy: false
}

export const getters = {
    newState: (assets) => {
    if(!Array.isArray(assets) || assets.length < 2) throw new TypeError("state: requires one or more assets")
        return mutations.touch({
            ...DEFAULT_STATE,
            validateAsset: asset => {
                if(!assets.includes(asset)){throw new TypeError(`state: invalid asset '${asset}'`)}
                return asset
            },
            validateForm: (formValues, balances) => {
                if(!balances) throw new TypeError("form: balances are missing")
                if(!formValues.tokenA || !formValues.tokenB) throw new TypeError("form: token cannot be empty")
                if(formValues.tokenA === formValues.tokenB) throw new TypeError("form: tokens cannot be identical")
                if(Number(formValues.amountADesired) > Number(balances[SUPPORTED_ASSETS[formValues.tokenA]])) throw new Error(`${asText[SUPPORTED_ASSETS[formValues.tokenA]]} Insufficient funds`)
                if(Number(formValues.amountBDesired) > Number(balances[SUPPORTED_ASSETS[formValues.tokenB]])) throw new Error(`${asText[SUPPORTED_ASSETS[formValues.tokenB]]} Insufficient funds`)
            }
        })
    }
}

export const mutations = {
    touch: state => ({
        ...state, 
        _version: 1 + (state._version || 0)
    }),
    setFormValue: (key, value) => state => {
        let stateWithPayloadValue = mutations.setWeb3PayloadValue(key, value)
        return stateWithPayloadValue( mutations.touch({
            ...state,
            formValues: {
                ...state?.formValues,
                [key]: value
            }
        }))
    },
    setWeb3PayloadValue: (key, value) => state => {
        switch (key) {
            case 'amountADesired':
                return mutations.touch({
                    ...state,
                    web3Payload: {
                        ...state?.web3Payload,
                        [key]: value,
                        amountAMin: value * 0.95
                    }
                })
            case 'amountBDesired':
                return mutations.touch({
                    ...state,
                    web3Payload: {
                        ...state?.web3Payload,
                        [key]: value,
                        amountBMin: value * 0.95
                    }
                })
            case 'to':
                return mutations.touch({
                    ...state,
                    web3Payload: {
                        ...state?.web3Payload,
                        [key]: ethers.utils.getAddress(value)
                    }
                })
            case 'tokenA':
            case 'tokenB':
                return mutations.touch({
                    ...state,
                    web3Payload: {
                        ...state?.web3Payload,
                        [key]: ADDRESSES[SUPPORTED_ASSETS[value]]
                    }
                })
            default:
                return state;
        }
    },
    // setRate: (reserves) => state => {
    //     // console.log(Object.keys(reserves), Object.values(reserves))
    //     let amounts = Object.values(reserves)
    //     let key = Object.keys(reserves).join('/')
    //     let rate = ethers.BigNumber.from(amounts[0])
    //         .div(ethers.BigNumber.from(amounts[1]))
    //     return mutations.touch({
    //         ...state,
    //         rates: {
    //             ...state?.rates,
    //             [key]: Math.round(rate)
    //         }
    //     })
    // }
}

export const promises = {
    getReserves: async (assetsPair) => {
        // let router = QUICKSWAP.router()
        let factory = QUICKSWAP.factory()
        let tokens = [...assetsPair].map(asset => ADDRESSES[asset])
        let pair = QUICKSWAP.pair( await factory.getPair(...tokens) )
        let asset0 = ADDRESSES[ (await pair.token0()).toUpperCase() ]
        let asset1 = ADDRESSES[ (await pair.token1()).toUpperCase() ]
        let reserves = await pair.getReserves()
        console.log('reserves', reserves)
        return {
            [asset0]: reserves[0],
            [asset1]: reserves[1],
        }
    },
    addLiquidity: async ({
        tokenA, //address
        tokenB, //address
        amountADesired, //uint
        amountBDesired, //uint
        amountAMin, //uint
        amountBMin, //uint
        to, //address
    }) => {
        const _contract = new ethers.Contract(
            ADDRESSES.QuickswapRouter,
            IUniswapV2Router02Json.abi,
            (new ethers.providers.Web3Provider(window.ethereum, 'any')).getSigner()
        );
        let params = [
            ethers.utils.getAddress(tokenA),
            ethers.utils.getAddress(tokenB),
            Number(amountADesired),
            Number(amountBDesired),
            Number(amountAMin),
            Number(amountBMin),
            ethers.utils.getAddress(to),
            Math.ceil(( Date.now()+(1000*60) ) / 1000) // Unix TS: now + 60s
        
        ]
        let res = await _contract.addLiquidity(...params);
        return res
    },
    addLiquidityETH: async ({
        token, //address
        amountTokenDesired, //uint
        amountTokenMin, //uint
        amountETHMin, //uint
        to, //address
        value, //uint
    }) => {
        const _contract = new ethers.Contract(
            ADDRESSES.QuickswapRouter,
            IUniswapV2Router02Json.abi,
            (new ethers.providers.Web3Provider(window.ethereum, 'any')).getSigner()
        );
        let params = [
            ethers.utils.getAddress(token),
            Number(amountTokenDesired),
            Number(amountTokenMin),
            Number(amountETHMin),
            ethers.utils.getAddress(to),
            Math.ceil(( Date.now()+(1000*60) ) / 1000), // Unix TS: now + 60s
            { value: ethers.utils.parseEther(Number(value).toString()) }
        ]
        let result = await _contract.addLiquidityETH(...params);
        return result
    },
    balanceOf: async (asset, account) => {
        const _contract = new ethers.Contract(
            ADDRESSES[asset],
            ERC20Json.abi,
            (new ethers.providers.Web3Provider(window.ethereum, 'any')).getSigner()
        )
        let balance = await _contract.balanceOf(ethers.utils.getAddress(account))
        return [asset, Number(balance)]
    }
}

export const observables = {
    balances$: new BehaviorSubject({})
}

// for convenience
// todo: remove
// window.router = new ethers.Contract(
//     ADDRESSES.QuickswapRouter,
//     IUniswapV2Router02Json.abi,
//     (new ethers.providers.Web3Provider(window.ethereum, 'any')).getSigner()
// );

// window.factory = new ethers.Contract(
//     ADDRESSES.QuickswapFactory,
//     IUniswapV2FactoryJson.abi,
//     (new ethers.providers.Web3Provider(window.ethereum, 'any')).getSigner()
// );
// window.pair = (addr) => new ethers.Contract(
//     addr,
//     IUniswapV2PairJson.abi,
//     (new ethers.providers.Web3Provider(window.ethereum, 'any')).getSigner()
// )