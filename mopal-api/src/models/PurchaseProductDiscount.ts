import { ActiveRecord } from "./ActiveRecord"
import { Product } from "./Product"
import { Purchase } from "./Purchase"

interface PurchaseProductDiscount {
    discount: number 
    productId: Product['id']
    assemblyGroup: number 
    purchaseId: Purchase['id']
}

class PurchaseProductDiscountRecord extends ActiveRecord<PurchaseProductDiscount> {
    tableName = "purchaseProductDiscount" 

    public discount: number 
    public productId: Product['id']
    public assemblyGroup: number 
    public purchaseId: Purchase['id']

    constructor(purchaseProductDiscount?: Partial<PurchaseProductDiscount>) {
        super()
        this.discount = purchaseProductDiscount?.discount ?? 0
        this.productId = purchaseProductDiscount?.productId ?? ''
        this.assemblyGroup = purchaseProductDiscount?.assemblyGroup ?? null
        this.purchaseId = purchaseProductDiscount?.purchaseId ?? 0
    }
}

export default PurchaseProductDiscountRecord