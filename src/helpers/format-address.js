import { ethers } from "ethers"

export function formatAddress(addr, l=4){
    let _addr = ethers.utils.getAddress(addr)
    return `${_addr.substr(0,l)}..${_addr.substr(_addr.length-l,l)}`
}