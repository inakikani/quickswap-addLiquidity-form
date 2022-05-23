import { createContext, useContext, useEffect, useMemo, useState } from "react"
import contractsAddresses from "../data/contracts-addresses"
import QSRouterJson from '../data/IUniswapV2Router02.json'
import SUPPORTED_ASSETS from "../data/supported-assets"
import { observables, promises } from "../state"
import { ClientError } from "./errors"
import { useContract } from './useContract'
import { EthereumContext } from "./useMetamask.hook"
import useObservable from "./useObservable.hooks"

export const AssetsContext = createContext({})

export function useAccountBalances({account, provider}) {
    const balances = useObservable(observables.balances$)
    const [error, setError] = useState(void 0)
    const [busy, setBusy] = useState(false)
    useEffect( () => {
        try {
            if(provider && account) {
                setBusy(true)
                Promise.all( Object.keys(SUPPORTED_ASSETS).map( asset => promises.balanceOf(asset, account)) )
                    .then(entries => {
                        console.log('entries', entries)
                        setBusy(false)
                        observables.balances$.next(Object.fromEntries(entries))
                    })
                    .catch(error => {
                        setBusy(false)
                        console.log('error args',error.args)
                        setError(new ClientError(error, "Failed to load account balances"))
                    })
            }
        } catch (error) {
            setBusy(false)
            setError(new ClientError(error, "Failed to load account balances"))
        }
    }, [provider, account])

    return [balances, error, busy]
}

export default useAccountBalances

// const _qsRouterOptions = useMemo(() => ({
//     address: contractsAddresses.QuickswapRouter,
//     abi: QSRouterJson.abi
// }))
// const [QSRouterContract] = useContract(provider, _qsRouterOptions)