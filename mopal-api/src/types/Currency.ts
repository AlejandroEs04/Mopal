const currencies = {
    MXN: 'mxn', 
    USD: 'usd'
} as const 

export type Currencies = typeof currencies[keyof typeof currencies]