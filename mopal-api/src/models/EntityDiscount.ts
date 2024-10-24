import { ActiveRecord } from "./ActiveRecord"
import { Entity } from "./Entity"
import { EntityDiscountPercentage } from "./EntityDiscountPercentage"

export interface EntityDiscount {
    id: number
    percentageTotal: number 
    entityId: Entity['id'] 
    favorite: boolean
    discounts: EntityDiscountPercentage[]
}

class EntityDiscountRecord extends ActiveRecord<EntityDiscountRecord> {
    tableName = 'entityDiscount'

    public id?: number 
    public percentageTotal: number 
    public entityId: Entity['id']  
    public favorite: boolean 

    constructor(entityDiscount? : Partial<EntityDiscount>) {
        super()
        this.id = entityDiscount?.id ?? null 
        this.percentageTotal = entityDiscount?.percentageTotal ?? 0
        this.entityId = entityDiscount?.entityId ?? 0
        this.favorite = entityDiscount?.favorite ?? true
    }
}

export default EntityDiscountRecord