import { EthereumContext, useMetamask } from './helpers/useMetamask.hook';
import useAccountBalances, { AssetsContext } from './helpers/useAccountBalances.hook';
import {ConnectMetamaskButton} from './components/ConnectMetamaskButton'
import { SupplyLiquidityForm } from './components/SupplyLiquidityForm'

function App() {
  const [provider, account, connect, ethErrors, clearEthErrors] = useMetamask()
  const [balances, balancesError, balancesBusy] = useAccountBalances({provider, account})
  return (
    <EthereumContext.Provider value={{provider, account, connect, errors: ethErrors, clear: clearEthErrors}}>
    <AssetsContext.Provider value={{balances, busy: balancesBusy, error: balancesError}}>
      <div className='bg-darkpurple text-white w-full h-full flex justify-center'>
        <div className='max-w-lg flex-grow flex-shrink mx-4'>
          <header className='flex justify-end basis-full flex-none mt-4'>
            <ConnectMetamaskButton onClick={!account ? connect : e=>{}}/>
          </header>
          
          {ethErrors && ethErrors.length > 0 
            && ethErrors.map( error => 
              <p key={error.message}
                onClick={clearEthErrors} 
                className={`text-white text-center py-2`}>{error.message}
              </p>
            )}
          
          <div className="block max-w-max my-20 mx-auto">
            <h1 className='text-4xl'>Provide Liquidity</h1>
            <h5 className='text-right text-grey'>via Quickswap</h5>
          </div>
          <main className="block w-full my-10">
            <SupplyLiquidityForm />
          </main>
        </div>
      </div>
    </AssetsContext.Provider>
    </EthereumContext.Provider>
  );
}

export default App;