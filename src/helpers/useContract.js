import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { ClientError } from "./errors"

export function useContract(provider,{address, abi}){
    const [contract, setContract] = useState(void 0)
    const [error, setError] = useState(void 0)
    useEffect(() => {
        try {
            if(!provider) { throw new TypeError( 'cannot instanciate contract without provider' )}
            if(!address) { throw new TypeError( 'cannot instanciate contract without address' )}
            if(!abi) { throw new TypeError( 'cannot instanciate contract without abi' )}
            setContract(new ethers.Contract(
                address,
                abi,
                (new ethers.providers.Web3Provider(window.ethereum, 'any')).getSigner()
            ))
            setError(void 0)
        } catch (error) {
            setContract(void 0)
            setError(new ClientError(error, "Unable to connect to smart contract"))
            return
        }
    }, [provider, address, abi])
    
    return [contract, error]
}