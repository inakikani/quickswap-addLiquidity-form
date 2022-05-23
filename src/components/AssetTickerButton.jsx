import { asText } from "../data/supported-assets"
import ICONS from "../data/assets-icons"

export function AssetTickerButton({
  asset,
  className,
  ...props
}) {
  let _iconUrl = ICONS[asset]
  let _tick = asText[asset]?.toUpperCase()
  return (<button {...props} className={`${className}`}>
    <img src={_iconUrl} className=""/>
    <span>{_tick}</span>
  </button>)
}