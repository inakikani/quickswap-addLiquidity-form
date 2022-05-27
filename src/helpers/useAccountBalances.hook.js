import { createContext, useEffect, useState } from "react"
import SUPPORTED_ASSETS from "../data/supported-assets"
import { observables, promises } from "../state"
import { ClientError } from "./errors"
import useObservable from "./useObservable.hooks"

export const AssetsContext = createContext({})

export function useAccountBalances({ account, provider }) {
    const [balances] = useObservable(observables.balances$)
    const [error, setError] = useState(void 0)
    const [busy, setBusy] = useState(false)
    useEffect(() => {
        try {
            if (provider && account) {
                setBusy(true)
                let balancePromises = Object.keys(SUPPORTED_ASSETS).map(asset => promises.balanceOf(asset, account))
                Promise.all(balancePromises)
                    .then(entries => {
                        console.log('entries', entries)
                        setBusy(false)
                        observables.balances$.next(Object.fromEntries(entries))
                    })
                    .catch(error => {
                        setBusy(false)
                        console.log('error args', error.args)
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