import { createContext, useEffect, useState } from 'react';
import {ethers} from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import {ClientError} from './errors';

export const EthereumContext = createContext({});

export function getMetamaskErrorReason(error){
    if(error.data) {
        return getMetamaskErrorReason(error.data)
    } else {
        return error.reason || error.message || 'MM:Unknown error'
    }
}

export function useMetamask() {
    const [provider, providerError] = useMetamaskProvider()
    const chainChangeError = useReloadOnChainIdChange(provider)
    const [account, connect, accountsError] = useUserAccounts()
    const [errors, setErrors] = useState([])
    useEffect(() => {
        setErrors(providerError || chainChangeError || accountsError ? [providerError, chainChangeError, accountsError].filter(x => !!x) : [])
        return ()=>{}
    }
    , [providerError,chainChangeError,accountsError])
    
    const clear = ()=>{setErrors([])}

    return [
        provider,
        account,
        connect,
        errors,
        clear
    ]
}

export function useReloadOnChainIdChange(provider) {
    const [error, setError] = useState(void 0)
    useEffect(() => {
        try {
            if(!window.ethereum) return
            window.ethereum.on('chainChanged', handleChainChanged);
            setError(void 0)
        } catch (error) {
            setError(new ClientError(error, "MM:unable to listen for chainChanged"))
        }
    }, [provider])

    function handleChainChanged(_chainId) {
        try {
            window.location.reload();
        } catch (error) {
            setError(new ClientError(error, "MM:unable to reload page after chainChanged"))
        }
    }

    return error
}

export function useUserAccounts() {
    const [currentAccount, setAccount] = useState(void 0);
    const [error, setError] = useState(void 0);
    useEffect(() => {
        try {
            if(!window.ethereum) return
            window.ethereum
                .request({ method: 'eth_accounts' })
                .then(handleAccountsChanged)
                .catch((err) => {
                    // Some unexpected error.
                    // For backwards compatibility reasons, if no accounts are available,
                    // eth_accounts will return an empty array.
                    setError(new ClientError(err, "MM:Promise failed. Unable to fetch ethereum accounts"));
                });
    
            // Note that this event is emitted on page load.
            // If the array of accounts is non-empty, you're already
            // connected.
            window.ethereum.on('accountsChanged', handleAccountsChanged);
        } catch (error) {
            setAccount(void 0)
            setError(new ClientError(error, "MM:unable to initiate ethereum accounts"))
        }

    }, [])


    function connect() {
        try {
            if(!window.ethereum) {
                console.log('ethereum is not supported')
                return
            }
            return window.ethereum
                .request({ method: 'eth_requestAccounts' })
                .then(handleAccountsChanged)
                .catch((err) => {
                    if (err.code === 4001) {
                        // EIP-1193 userRejectedRequest error
                        // If this happens, the user rejected the connection request.
                        setError(new Error("MM:4001: Please connect to MetaMask.")); // no need to log via Err
                    } else {
                        if(err.code === -32002){
                            // when user close metamask while connecting, this locks the connect button >> hard reload
                            window.location.reload()
                        }
                        setError(new ClientError(err, "MM:Promise failed: Unable to requestAccounts (reload page)."))
                    }
                });
        } catch (error) {
            setError(new ClientError(error, "MM:Unable to initiate requestAccounts."))
        }
    }
    // 'eth_accounts' return an array
    function handleAccountsChanged(accounts) {
        try {
            if (accounts.length === 0) {
                // MetaMask is locked or the user has not connected any accounts
                setAccount(void 0);
                throw new Error('accounts.length === 0')
            } else if (accounts[0] !== currentAccount) {
                console.log('accounts', accounts)
                setAccount(accounts[0]);
                setError(void 0)
            }
        } catch (error) {
            setAccount(void 0)
            if(error.message === 'accounts.length === 0') {
                setError(new Error("Connect MetaMask"))
            } else {
                setError(new ClientError(error, "Unabe to handle accounts changed, try reloading the page and/or metamask"))
            }
        }
    }

    return [currentAccount, connect, error]
}

export function useMetamaskProvider(isOff=false) {

    const [provider, setProvider] = useState(void 0)
    const [error, setError] = useState(void 0)
    useEffect(() => {
        try {
            if(isOff) return
            detectEthereumProvider()
                .then(_prov => {
                    if (_prov) {
                        // From now on, this should always be true: provider === window.ethereum
                        if (_prov !== window.ethereum) {
                            setError(new Error('Do you have multiple wallets installed? This may cause disfunctions'));
                        } else {
                            setError(void 0)
                        }
                        setProvider(new ethers.providers.Web3Provider(_prov, 'any'))
                    } else {
                        setProvider(void 0)
                        setError(new Error('Please install MetaMask!'));
                    }
                })
                .catch(err => {
                    setError(err, "Promise failed: unable to detect Ethereum provider")
                });
        } catch (error) {
            setError(error, "Unable to initiate detection of ethereum provider")
        }
        return () => { }
    }, [isOff])

    return [provider, error]
}