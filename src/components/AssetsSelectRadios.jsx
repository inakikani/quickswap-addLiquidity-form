import SUPPORTED_ASSETS from "../data/supported-assets"
import { classes } from '../helpers/css-classes'
import { AssetRadioInput } from './AssetRadioInput'

export function AssetsSelectRadios({
  currentAsset,
  name,
  className
}) {
  return (
    <div className={`${className}`}
      onClick={e => e.stopPropagation()} // do not trigger backdrop click on inner clicks
    >
      <h1 className='w-full text-xl my-4'>Select Token</h1>
      {Object.keys(SUPPORTED_ASSETS).map(asset => (
        <AssetRadioInput key={asset}
          name={name}
          asset={asset}
          className={`
                  ${asset === currentAsset ? classes.rowInactive : classes.row}
                  ${asset === currentAsset || classes.clickable} 
                  ${asset === currentAsset && 'border border-lightpink/30'}
                  flex justify-between items-center w-full 
                `}
        />
      ))}
    </div>
  )
}

export default AssetsSelectRadios