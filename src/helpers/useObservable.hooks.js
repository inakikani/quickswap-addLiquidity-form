import { useEffect, useState } from "react";

function useObservable(obs$){
    const [state, setState] = useState()
    const [error, setError] = useState()
    useEffect(() => {
        try {
            let sub = obs$.subscribe({
                next: setState,
                error: console.warn
            })
            return ()=>{sub.unsubscribe()}
        } catch (error) {
            console.log(error)
            setError(error)
        }
    }, [obs$])

    return [state, error]
}

export default useObservable