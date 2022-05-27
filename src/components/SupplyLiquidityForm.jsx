import { useContext, useEffect, useState } from 'react';
import SUPPORTED_ASSETS from "../data/supported-assets"
import { getters, mutations, promises } from '../state';
import { classes } from '../helpers/css-classes'
import { FormControl } from './FormControl'
import { AssetTokensAmountInput } from './AssetTokensAmountInput'
import { AssetTickerButton } from './AssetTickerButton'
import { AssetBalanceSmall } from './AssetBalanceSmall'
import { AssetsSelectRadios } from './AssetsSelectRadios'
import { FormSingleSubmitButton } from './FormSingleSubmitButton'
import { EthereumContext, getMetamaskErrorReason } from '../helpers/useMetamask.hook';
import { ClientError } from '../helpers/errors';
import Loading from './Loading';
import { AssetsContext } from '../helpers/useAccountBalances.hook';
import { FullScreenOverlay } from './FullScreenOverlay';

export function SupplyLiquidityForm() {
  const { account } = useContext(EthereumContext)
  const { balances } = useContext(AssetsContext)
  const [state, setState] = useState(getters.newState(Object.values(SUPPORTED_ASSETS)))
  useEffect(() => {
    if (!account) return
    setState(mutations.setWeb3PayloadValue('to', account))
  }, [account])

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(void 0)
  const [formError, setFormError] = useState(void 0)
  const [success, setSuccess] = useState(void 0)
  useEffect(() => {
    let delay
    if (success) {
      delay = setTimeout(() => { setSuccess(void 0) }, 3000)
    }
    return () => { clearTimeout(delay) }
  }, [success])

  const [tokenToSwitchFor, setTokenToSwitchFor] = useState(void 0)
  const [assetToSwitch, setAssetToSwitch] = useState(void 0)

  const onSubmit = e => {
    try {
      e.preventDefault()
      setBusy(true)
      let ethIdx = [state.formValues.tokenA, state.formValues.tokenB].indexOf(SUPPORTED_ASSETS.WETH)
      let hasEth = ethIdx !== -1
      let _notEthToken = ethIdx === 1 ? 'A' : 'B'
      let _ethToken = ethIdx === 0 ? 'A' : 'B'
      let _addLiquidityFn = hasEth
        ? promises.addLiquidityETH
        : promises.addLiquidity
      let _addLiquidtyParams = hasEth
        ? {
          token: state.web3Payload[`token${_notEthToken}`],
          amountTokenDesired: state.web3Payload[`amount${_notEthToken}Desired`],
          amountTokenMin: state.web3Payload[`amount${_notEthToken}Min`],
          amountETHMin: state.web3Payload[`amount${_ethToken}Min`],
          to: state.web3Payload.to,
          value: state.web3Payload[`amount${_ethToken}Desired`]
        }
        : {
          tokenA: state.web3Payload.tokenA,
          tokenB: state.web3Payload.tokenB,
          amountADesired: state.web3Payload.amountADesired,
          amountBDesired: state.web3Payload.amountBDesired,
          amountAMin: state.web3Payload.amountAMin,
          amountBMin: state.web3Payload.amountBMin,
          to: state.web3Payload.to,
        }
      _addLiquidityFn(_addLiquidtyParams)
        .then(() => {
          setBusy(false)
          setSuccess("Success")
        })
        .catch(error => {
          setBusy(false)
          setError(new ClientError(error, getMetamaskErrorReason(error)))
        })

    } catch (error) {
      setError(new ClientError(error, "Unable to add liquidity"))
    }
  }

  const onChange = e => {
    try {
      const { name, value } = e.target
      setFormError(void 0)
      let newState = mutations.setFormValue(name, value)({ ...state })
      state.validateForm(newState.formValues, balances)
      setState(mutations.setFormValue(name, value))
      closeSelectAssetModal()

    } catch (error) {

      switch (error.message) {
        case "form: tokens cannot be identical":
          break;
        default:
          setFormError(error)
          break;
      }
      console.log(error)
      closeSelectAssetModal()
    }
  }

  // useEffect(() => {
  //   try {
  //     if (!state?.formValues?.tokenA || !state?.formValues?.tokenB) return
  //     promises.getReserves([state.formValues.tokenA, state.formValues.tokenB])
  //       .then(reserves => {
  //         setState(mutations.setRate(reserves))
  //       })
  //       .catch(console.log)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }, [state?.formValues?.tokenA, state?.formValues?.tokenB])

  const openSelectAssetModalForToken = (token, asset) => e => {
    e.preventDefault()
    setAssetToSwitch(asset)
    setTokenToSwitchFor(token)
  }
  const closeSelectAssetModal = e => { setTokenToSwitchFor(void 0) }

  return (
    <form className={classes.card}
      onSubmit={onSubmit} onChange={onChange}
    >
      {/* TokenA */}
      <FormControl className={`flex justify-between items-start gap-4`}>
        <div className={`
            relative flex flex-col items-start
            basis-0 flex-shrink flex-grow
          `}
        >
          <AssetTokensAmountInput name="amountADesired" />
          <AssetBalanceSmall asset={state?.formValues?.tokenA} />
        </div>
        <AssetTickerButton
          className={`${classes.tickerButton} ${classes.clickable} bg-medpurple flex-none`}
          onClick={openSelectAssetModalForToken('tokenA', state?.formValues?.tokenA)}
          asset={state?.formValues?.tokenA}
        />
      </FormControl>

      <div className='flex justify-center text-white h-0 items-center text-4xl'>+</div>

      {/* TokenB */}
      <FormControl className={`flex justify-between items-start gap-4`}>
        <div className={`
            relative flex flex-col items-start
            basis-0 flex-shrink flex-grow
          `}
        >
          <AssetTokensAmountInput name="amountBDesired" />
          <AssetBalanceSmall asset={state?.formValues?.tokenB} />
        </div>
        <AssetTickerButton
          className={`${classes.tickerButton} ${classes.clickable} bg-medpurple flex-none`}
          onClick={openSelectAssetModalForToken('tokenB', state?.formValues?.tokenB)}
          asset={state?.formValues?.tokenB}
        />
      </FormControl>

      <FormSingleSubmitButton
        disabled={!!formError}
        className={`
        bg-lightblue text-darkblue mt-4
          ${!formError && classes.clickable} 
          ${formError && 'bg-opacity-40'} 
          ${formError && 'text-darkpurple'} 
          transition-all duration-300
        `}
      >
        Supply
      </FormSingleSubmitButton>

      {/* notifications */}
      <div
        className={`
        mt-4 transition-opacity duration-300
        ${error || formError || success || busy ? 'opacity-100' : 'opacity-0'}
      `}>
        {busy && <p className='line-clamp-3 text-center'> <Loading className="text-4xl" /> </p>}
        {error && <p className='line-clamp-3 text-center'> {error.message} </p>}
        {formError && <p className='line-clamp-3 text-center'> {formError.message} </p>}
        {success && <p className='line-clamp-3 text-center'> {success} </p>}
      </div>

      {/* Switch asset modal */}
      <FullScreenOverlay open={tokenToSwitchFor} onClose={closeSelectAssetModal}
        className={`bg-opacity-50 bg-black flex justify-center`}
      >
        {tokenToSwitchFor && (
          <div className={`${classes.card} max-w-lg mx-4 my-auto`}>
            <AssetsSelectRadios 
              name={tokenToSwitchFor}
              className={`flex-grow`}
              currentAsset={assetToSwitch} 
            />
            <FormSingleSubmitButton className="mt-4" onClick={closeSelectAssetModal}>Back</FormSingleSubmitButton>
          </div>
        )}
      </FullScreenOverlay>
    </form>)
}