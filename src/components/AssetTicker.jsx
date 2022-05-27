import { asText } from "../data/supported-assets"
import ICONS from "../data/assets-icons"

export function AssetTicker({
  asset,
  className,
  ...props
}) {
  let _iconUrl = ICONS[asset]
  let _tick = asText[asset]?.toUpperCase()
  return (<div {...props} className={`${className}`}>
    <img src={_iconUrl} className="" alt="icon of a crypto asset" />
    <span>{_tick}</span>
  </div>)
}

export default AssetTicker