export function FormSingleSubmitButton({
  className,
  children,
  ...props
}) {
  return (<button {...props} className={`block w-full rounded-md p-3 ${className}`}>
    <span>{children || "Submit"}</span>
  </button>)
}

export default FormSingleSubmitButton