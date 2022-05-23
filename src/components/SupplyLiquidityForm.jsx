import { useContext, useEffect, useState } from 'react';
import SUPPORTED_ASSETS from "../data/supported-assets"
import ADDRESSES from '../data/contracts-addresses'
import { getters, mutations, promises } from '../state';
import { classes } from '../helpers/css-classes'
import {FormControl} from './FormControl'
import { AmountDesiredNumberInput } from './AmountDesiredNumberInput'
import { AssetTickerButton } from './AssetTickerButton'
import { FormSingleSubmitButton } from './FormSingleSubmitButton'
import { AssetRadioInput } from './AssetRadioInput'
import { EthereumContext, getMetamaskErrorReason } from '../helpers/useMetamask.hook';
import { ClientError } from '../helpers/errors';
import Loading from './Loading';
import { AssetsContext } from '../helpers/useAccountBalances.hook';

export function SupplyLiquidityForm() {
  const {account} = useContext(EthereumContext)
  const {balances} = useContext(AssetsContext)
  const [state, setState] = useState(getters.newState(Object.values(SUPPORTED_ASSETS)))
  
  useEffect( () => {
    if(!account) return
    setState( mutations.setFormProperty('to', account) )
  }, [account])
  
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(void 0)
  const [success, setSuccess] = useState(void 0)

  const invalidFormValues = () => {
    let desiredAmounts = state.tuple.map( (asset,idx) => idx === 0 ? state.amountADesired : state.amountBDesired)
    let availableAmounts = state.tuple.map( (asset,idx) => balances?.[asset])
    return desiredAmounts[0] > availableAmounts[0] || desiredAmounts[1] > availableAmounts[1]
  }

  const onSubmit = e => {
    try {
      e.preventDefault()
      invalidFormValues()
      setBusy(true)
      console.log('onSubmit', state)
      let ethIdx = state.tuple.indexOf(SUPPORTED_ASSETS.WETH)
      let hasEth = ethIdx !== -1
      let _notEthToken = ethIdx === 1 ? 'A' : 'B'
      let _ethToken = ethIdx === 0 ? 'A' : 'B'
      let _addLiquidityFn = hasEth
        ? promises.addLiquidityETH
        : promises.addLiquidity
      let _addLiquidtyParams = hasEth
        ? {
          token: state[`token${_notEthToken}`],
          amountTokenDesired: state[`amount${_notEthToken}Desired`],
          amountTokenMin: state[`amount${_notEthToken}Min`],
          amountETHMin: state[`amount${_ethToken}Min`],
          to: state.to,
          value: state[`amount${_ethToken}Desired`]
        }
        : {
          tokenA: state.tokenA, 
          tokenB: state.tokenB, 
          amountADesired: state.amountADesired,
          amountBDesired: state.amountBDesired,
          amountAMin: state.amountAMin,
          amountBMin: state.amountBMin,
          to: state.to,
        }
      _addLiquidityFn(_addLiquidtyParams)
        .then(res => {
          setBusy(false)
          setSuccess("OK")
        })
        .catch(error => {
          setBusy(false)
          setError( new ClientError(error, getMetamaskErrorReason(error)))
        })

    } catch (error) {
      setError( new ClientError( error, "Unable to add liquidity" ))
    }
  }

  const onChange = e => {
    const {name, value} = e.target
    console.log(name, value)
    
    switch (name) {
      case 'amountADesired':
        setState( mutations.setFormProperty('amountAMin', value*0.95) )
      case 'amountBDesired':
        setState( mutations.setFormProperty('amountBMin', value*0.95) )
        setState( mutations.setFormProperty(name, value) )
        break;
      case 'pick-asset':
        let _name = tgtToken === 0 ? 'tokenA' : 'tokenB'
        setState( mutations.setFormProperty(_name, ADDRESSES[value]) )
        setState( mutations.switchAsset(tgtToken, value) )
        break;
    
      default:
        break;
    }
    closeSelectAssetModal()
  }

  const [tgtToken, setTgtToken] = useState(void 0)
  const openSelectAssetModalForToken = tupleIndex => e => {
    // e.stopPropagation()
    e.preventDefault()
    setTgtToken(tupleIndex)
    setOpen(true) 
  }
  const closeSelectAssetModal = e => { setOpen(false) }

  return (
  <form className={classes.card}
    onSubmit={onSubmit} onChange={onChange}
  >
    {/* TokenA */}
    <FormControl className={`flex justify-between items-start gap-4`}>
      <AmountDesiredNumberInput 
        name="amountADesired"
        asset={state?.tuple?.[0]}
        className={`relative basis-0 flex-shrink flex-grow`}
      />
      <AssetTickerButton
        onClick={openSelectAssetModalForToken(0)}
        asset={state?.tuple?.[0]}
        className={`${classes.tickerButton} ${classes.clickable} bg-medpurple flex-none`}
      />
    </FormControl>
    
    <div className='flex justify-center text-white h-0 items-center text-4xl'>+</div>
    
    {/* TokenB */}
    <FormControl className={`flex justify-between items-start gap-4`}>
      <AmountDesiredNumberInput 
        name="amountBDesired"
        asset={state?.tuple?.[1]}
        className={`relative basis-0 flex-shrink flex-grow`}
      />
      <AssetTickerButton 
        onClick={openSelectAssetModalForToken(1)}
        asset={state?.tuple?.[1]}
        className={`${classes.tickerButton} ${classes.clickable} bg-medpurple flex-none`}
      />
    </FormControl>
    <FormSingleSubmitButton disabled={invalidFormValues()} className={`${classes.clickable} bg-lightblue text-darkblue mt-4`}>Supply</FormSingleSubmitButton>

    {/* notifications */}
    <div 
      className={`
        mt-4 transition-opacity duration-300
        ${error || success || busy ? 'opacity-100' : 'opacity-0'}
      `}>
      {busy && <p className='line-clamp-3 text-center'><Loading className="text-4xl"/></p>}
      {error && <p className='line-clamp-3 text-center'>{error.message}</p>}
      {success && <p className='line-clamp-3 text-center'>{success}</p>}
    </div>

    {/* Switch asset modal */}
    <div onClick={closeSelectAssetModal} className={ // backdrop & container
      `fixed h-screen w-screen top-0 left-0 bg-opacity-50 bg-black 
      flex justify-center
      transition-all duration-300 ease-in-out
      ${open
        ?'translate-x-0 opacity-100'
        :'translate-x-full opacity-0'
      }`
    }>
      {open 
      && 
      <div className={`${classes.card} max-w-lg flex-grow mx-4 my-auto`}
        onClick={e => e.stopPropagation()} // do not trigger backdrop click on inner clicks
      >
        <h1 className='w-full text-xl my-4'>Select Token</h1>
        {Object.keys(SUPPORTED_ASSETS).map( asset => (
            <AssetRadioInput key={asset}
              asset={asset}
              className={`
                ${asset === state?.tuple?.[tgtToken] ? classes.rowInactive : classes.row}
                ${asset === state?.tuple?.[tgtToken] || classes.clickable} 
                ${asset === state?.tuple?.[tgtToken] && 'border border-lightpink/30'}
                flex justify-between items-center w-full 
              `}
            />
        ))}
        <FormSingleSubmitButton className="mt-4" onClick={closeSelectAssetModal}>Back</FormSingleSubmitButton>
      </div>}
    </div>
  </form>)
}