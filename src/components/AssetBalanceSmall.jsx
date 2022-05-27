import { useContext } from 'react';
import { AssetsContext } from '../helpers/useAccountBalances.hook';
import { Loading } from './Loading'

export function AssetBalanceSmall({
  asset,
  className,
  ...props
}) {
  const { balances, busy } = useContext(AssetsContext)

  return (
    <small className={`text-xs text-lightgrey ${className}`} {...props}>
      Balance: {busy
        ? <Loading />
        : (balances && balances[asset]) || '0.0'
      }
    </small>
  )
}