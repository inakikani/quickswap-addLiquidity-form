import { BehaviorSubject } from "rxjs"
import SUPPORTED_ASSETS from "../data/supported-assets"
import ADDRESSES from '../data/contracts-addresses'
import { ethers } from "ethers"
import ERC20Json from '../data/IUniswapV2ERC20.json'

const DEFAULT_STATE = {
    _name: "swapAssetsForm",
    tuple: [SUPPORTED_ASSETS.WMATIC, SUPPORTED_ASSETS.WETH],
    tokenA: ADDRESSES[SUPPORTED_ASSETS.WMATIC],
    tokenB: ADDRESSES[SUPPORTED_ASSETS.WETH],
    amountADesired: 0,
    amountBDesired: 0,
    amountAMin: 0,
    amountBMin: 0,
    to: void 0,
    deadline: void 0,
    validateAsset: ()=>{},
    warnings: [],
    errors: [],
    success: void 0,
    busy: false
}

// token, //address
// amountTokenDesired, //uint
// amountTokenMin, //uint
// amountETHMin, //uint
// to, //address
// deadline //uint

export const getters = {
    newState: (assets) => {
    if(!Array.isArray(assets) || assets.length < 2) throw new TypeError("state:requires one or more assets")
        return mutations.touch({
            ...DEFAULT_STATE,
            validateAsset: asset => {
                if(!assets.includes(asset)){throw new TypeError(`state:invalid asset '${asset}'`)}
                return asset
            }
        })
    }
}

const trimLeftLength2 = leftTrimArrayLength.bind(0, 2)

export const mutations = {
    touch: state => ({
        ...state, 
        _version: 1 + (state._version || 0)
    }),
    push: (key, value) => state => mutations.touch({
        ...state,
        [key]: trimLeftLength2([...state[key], value])
    }),
    pop: (key) => state => mutations.touch({
        ...state,
        [key]: [...(state[key].pop() && state[key])]
    }),
    setFormProperty: (key, value) => state => mutations.touch({
        ...state,
        [key]: value
    }),
    switchAsset: (tupleIdx, asset) => ({...state}) => {
        let _otherAsset = state.tuple[tupleIdx?0:1]
        if(_otherAsset === state.validateAsset(asset)) {
            return mutations.touch({...state, warnings: []})
        }
        let _new = [...state.tuple]
        _new[tupleIdx] = asset
        return mutations.touch({
            ...state,
            tuple: _new
        })
    }
}

export const promises = {
    addLiquidity: payload => Promise.resolve([0,0,0]),
    addLiquidityETH: payload => Promise.resolve([0,0,0]),
    balanceOf: async function(asset, account){
        const _contract = new ethers.Contract(
            ADDRESSES[asset],
            ERC20Json.abi,
            (new ethers.providers.Web3Provider(window.ethereum, 'any')).getSigner()
        )
        console.log('balanceOf', asset, account, _contract.address)
        let balance = await _contract.balanceOf(ethers.utils.getAddress(account))
        console.log('res', balance)
        return [asset, Number(balance)]
    }
}

export const observables = {
    balances$: new BehaviorSubject({})
}

function leftTrimArrayLength(l, arr){
    while(arr.length > l){
        arr.shift()
    }
    return arr
}