export function AssetTokensAmountInput({
  name,
  className,
  ...props
}) {
  return (
    <input id={'asset-tokens-amount' + name} name={name} defaultValue={'0.0'}
      className={`bg-transparent text-white text-3xl w-full ${className}`}
      type="number"
      min="0"
      step="0.000001"
      {...props}
    />
  )
}