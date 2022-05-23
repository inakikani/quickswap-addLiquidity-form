import { useContext } from 'react';
import { AssetsContext } from '../helpers/useAccountBalances.hook';
import { Loading }  from './Loading'

export function AmountDesiredNumberInput({
  asset,
  name,
  className,
  ...props
}) {
  const {balances, busy} = useContext(AssetsContext)
  console.log('balances', balances)
  return (<div className={`flex flex-col ${className || ""} items-start`}>
    <input
      className={`bg-transparent text-white text-3xl w-full`}
      type="number" min="0" max={(balances && balances[asset]) || 0} id={'addLiquidity-form'+name} name={name} defaultValue={'0.0'}
      {...props}
    />
    <small className='text-xs text-lightgrey'>
      Balance: { busy 
        ? <Loading />
        : (balances && balances[asset]) || 0
      }
    </small>
  </div>)
}