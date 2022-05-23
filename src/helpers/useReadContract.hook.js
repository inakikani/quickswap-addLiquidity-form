import { useState } from "react"

export function useReadContract(contract, methodName, ...params){
	const [flag, setFlag] = useState(true)
	const refresh = () => {setFlag(prev => !prev)}
	const [v, setV] = useState(void 0)
	const [err, setErr] = useState(void 0)
	useEffect( () => {
		try {
			if(!contract || !methodName) return
			const _promise = params
				? contract[methodName](...params)
				: contract[methodName]()
			
			_promise.then(res => {
				setV(res)
			})
			.catch(error => {
				console.log("error:useContractGetter:",{contract, methodName, params},error)
				setErr(error)
			})
		} catch (error) {
			setErr(error)
		}
	}, [flag, address, abi, methodName, ...params])

	return [v, err, refresh]
}