import { ActiveRecord } from "./ActiveRecord"

const actions = {
    SALE: 'sale', 
    PURCHASE: 'purchase', 
    QUOTATION: 'quotation', 
    REQUEST: 'request', 
    ALL: 'all'
} as const 

export type Actions = typeof actions[keyof typeof actions]

const types = {
    INTERNAL: 'internal', 
    EXTERNAL: 'external', 
    ALL: 'all'
} as const

export type Types = typeof types[keyof typeof types]

interface Observation {
    id: number 
    description: string 
    action: Actions
    type: Types
}

class ObservationRecord extends ActiveRecord<Observation> {
    tableName = "obervation"
    
    public id: number 
    public description: string 
    public action: Actions
    public type: Types

    constructor(observation?: Partial<Observation>) {
        super()
        this.id = observation?.id ?? null
        this.description = observation?.description ?? ''
        this.action = observation?.action ?? 'all'
        this.type = observation?.type ?? 'all'
    }
}

export default ObservationRecord