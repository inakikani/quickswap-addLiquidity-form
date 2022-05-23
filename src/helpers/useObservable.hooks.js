import { useEffect, useState } from "react";

function useObservable(obs$){
    const [state, setState] = useState()
    useEffect(() => {
        try {
            let sub = obs$.subscribe({
                next: setState,
                error: console.warn
            })
            return ()=>{sub.unsubscribe()}
        } catch (error) {
            console.log(error)
        }
    }, [obs$])

    return state
}

export default useObservable