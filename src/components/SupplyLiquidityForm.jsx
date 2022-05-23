import { useEffect, useState } from 'react';
import SUPPORTED_ASSETS from "../data/supported-assets"
import ADDRESSES from '../data/contracts-addresses'
import { getters, mutations } from '../state';
import { classes } from '../helpers/css-classes'
import {FormControl} from './FormControl'
import { AmountDesiredNumberInput } from './AmountDesiredNumberInput'
import { AssetTickerButton } from './AssetTickerButton'
import { FormSingleSubmitButton } from './FormSingleSubmitButton'
import { AssetRadioInput } from './AssetRadioInput'

export function SupplyLiquidityForm({
  account
}) {
  const [state, setState] = useState(getters.newState(Object.values(SUPPORTED_ASSETS)))
  useEffect( () => {
    if(!account) return
    setState( mutations.setFormProperty('to', account) )
  }, [account])
  const [open, setOpen] = useState(false)

  const onSubmit = e => {
    e.preventDefault()
    console.log('onSubmit', state)
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
    setTgtToken(tupleIndex)
    setOpen(true) 
  }
  const closeSelectAssetModal = e => { setOpen(false) } 

  return (<form className={classes.card}
    onSubmit={onSubmit} onChange={onChange}
  >
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
    <FormSingleSubmitButton className={`${classes.clickable} bg-lightblue text-darkblue mt-2`}>Supply</FormSingleSubmitButton>

    {/* select asset modal */}
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
      && <div className={`${classes.card} max-w-lg flex-grow mx-4 my-auto`}
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
        <FormSingleSubmitButton onClick={closeSelectAssetModal}>Back</FormSingleSubmitButton>
      </div>}
    </div>
  </form>)
}