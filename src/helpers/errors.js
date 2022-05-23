import { Subject } from "rxjs"

export class ClientError extends Error {
    constructor(error, ...args){
        super(...args)
        logError(error)
    }
}

export const observables = {
    error$: new Subject(void 0),
    errors$: new Subject([]),
}

function logError(error){
    console.log(error)
}