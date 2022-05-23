import { classes } from '../helpers/css-classes'

export function FormControl({
  className,
  ...props
}) {
  return props?.children && (<div {...props} className={`${classes.row} ${className}`}></div>)
}

export default FormControl