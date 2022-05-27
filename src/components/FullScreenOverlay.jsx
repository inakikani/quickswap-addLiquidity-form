export function FullScreenOverlay({
    open,
    onClose,
    className,
    ...props
}) {
    return (
        <div onClick={onClose} className={`
            fixed h-screen w-screen top-0 left-0 
            transition-all duration-300 ease-in-out
            backdrop-blur-sm
            ${open
                ? 'translate-x-0 opacity-100'
                : 'translate-x-full opacity-0'
            }
            ${className}`}
            {...props}
        >

        </div>
    )
}