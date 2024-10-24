import { ActiveRecord } from "./ActiveRecord"

const entityTypes = {
    CUSTOMER: 'customer',
    SUPPLIER: 'supplier'
} as const

export type EntityType = typeof entityTypes[keyof typeof entityTypes]

export interface Entity {
    id: number 
    businessName: string
    email: string 
    address: string 
    rfc: string 
    contactName: string 
    type: EntityType
}

class EntityRecord extends ActiveRecord<Entity> {
    tableName = 'entity'

    public id?: number
    public businessName: string 
    public email: string 
    public address: string 
    public rfc: string 
    public contactName: string 
    public type: EntityType

    constructor(entity?: Partial<Entity>) {
        super()
        this.id = entity?.id ?? null
        this.businessName = entity?.businessName ?? ''
        this.email = entity?.email ?? ''
        this.address = entity?.address ?? ''
        this.rfc = entity?.rfc ?? ''
        this.contactName = entity?.contactName ?? ''
        this.type = entity.type
    }
}

export default EntityRecord