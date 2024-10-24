import { Currencies } from "../types/Currency"
import { ActiveRecord } from "./ActiveRecord"
import { Product } from "./Product"
import { Purchase } from "./Purchase"

export interface PurchaseProduct {
    purchaseId: Purchase['id'] 
    productId: Product['id']
    assemblyGroup: number 
    quantity: number 
    discount: number 
    pricePerUnit: number 
    observations: string 
    currency: Currencies
}

class PurchaseProductRecord extends ActiveRecord<PurchaseProduct> {
    tableName = 'purchaseProduct'
    
    public purchaseId: Purchase['id'] 
    public productId: Product['id']
    public assemblyGroup: number 
    public quantity: number 
    public discount: number 
    public pricePerUnit: number 
    public observations: string 
    public currency: Currencies

    constructor(purchaseProduct?: Partial<PurchaseProduct>) {
        super()
        this.purchaseId = purchaseProduct?.purchaseId
        this.productId = purchaseProduct?.productId
        this.assemblyGroup = purchaseProduct?.assemblyGroup ?? null
        this.quantity = purchaseProduct?.quantity ?? 0
        this.discount = purchaseProduct?.discount ?? 0
        this.pricePerUnit = purchaseProduct?.pricePerUnit ?? 0
        this.observations = purchaseProduct?.observations ?? ''
        this.currency = purchaseProduct?.currency ?? 'usd'
    }
}

export default PurchaseProductRecord