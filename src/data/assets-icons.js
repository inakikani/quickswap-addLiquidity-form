import eth_icon_url from '../pngs/eth.png'
import matic_icon_url from '../pngs/matic.png'
import usdc_icon_url from '../pngs/usdc.png'
import wbtc_icon_url from '../pngs/wbtc.png'
import metamask_icon_url from '../svgs/metamask-fox.svg'
import SUPPORTED_ASSETS from './supported-assets'

const ICONS = {
    [SUPPORTED_ASSETS.WETH]: eth_icon_url,
    [SUPPORTED_ASSETS.WMATIC]: matic_icon_url,
    [SUPPORTED_ASSETS.USDC]: usdc_icon_url,
    [SUPPORTED_ASSETS.WBTC]: wbtc_icon_url,
    metamask: metamask_icon_url
}

export default ICONS