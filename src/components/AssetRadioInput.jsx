import { useContext } from 'react';
import { AssetsContext } from '../helpers/useAccountBalances.hook';
import {AssetTicker} from './AssetTicker'
import { classes } from '../helpers/css-classes'

export function AssetRadioInput({
  asset,
  name="pick-asset",
  className,
  ...props
}) {
  const {balances} = useContext(AssetsContext)
  return (<>
    <input 
      type="radio" id={`radio-${asset}`} name={name} 
      className='hidden'
      value={asset}
    />
    <button className='w-full relative'>
      <label htmlFor={`radio-${asset}`} className={`${className}`}>
        <AssetTicker asset={asset} className={`${classes.tickerText}`}/>
        <span>{balances?.[asset] || 0}</span>
      </label>
    </button>
  </>)
}