export class ClientError extends Error {
    constructor(error, ...args){
        super(...args)
        logError(error)
    }
}

function logError(error){
    console.log(error)
}