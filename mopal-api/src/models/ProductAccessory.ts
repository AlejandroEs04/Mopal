import { ActiveRecord } from "./ActiveRecord"
import { Product } from "./Product"

export interface ProductAccessory {
    productId: Product['id'] 
    accessoryId: Product['id']  
}

class ProductAccessoryRecord extends ActiveRecord<ProductAccessory> {
    tableName = "productAccessory"

    public productId: Product['id'] 
    public accessoryId: Product['id'] 

    constructor(productAccessory?: Partial<ProductAccessory>) {
        super()
        this.productId = productAccessory?.productId
        this.accessoryId = productAccessory?.accessoryId
    }
}

export default ProductAccessoryRecord