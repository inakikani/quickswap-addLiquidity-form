import { useContext } from 'react';
import { ReactComponent as MetamaskIcon } from '../svgs/metamask-fox.svg'
import { EthereumContext } from '../helpers/useMetamask.hook';
import { classes } from '../helpers/css-classes'
import { formatAddress } from '../helpers/format-address';

export function ConnectMetamaskButton({
  className,
  ...props
}) {
  const { account } = useContext(EthereumContext)
  return <button
    className={`
      flex gap-2 justify-center items-center 
      px-4 py-1 border border-pink rounded-full 
      ${classes.clickable} 
      ${className}
    `}
    {...props}
  >
    <MetamaskIcon className='w-8 h-8' />
    <span className='text-lightpink'>{account ? formatAddress(account) : 'Connect'}</span>
  </button>
}