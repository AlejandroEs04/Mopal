import { ActiveRecord } from "./ActiveRecord"
import { EntityDiscount } from "./EntityDiscount"

export interface EntityDiscountPercentage {
    discountId: EntityDiscount['id'] 
    percentage: number
}

class EntityDiscountPercentageRecord extends ActiveRecord<EntityDiscountPercentage> {
    tableName = 'entityDiscountPercentage'

    public discountId: EntityDiscount['id']  
    public percentage: number 

    constructor(entityDiscountPercentage?: Partial<EntityDiscountPercentage>) {
        super()
        this.discountId = entityDiscountPercentage?.discountId
        this.percentage = entityDiscountPercentage?.percentage ?? 0
    }
}

export default EntityDiscountPercentageRecord