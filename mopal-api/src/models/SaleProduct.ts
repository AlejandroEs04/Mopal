import { Currencies } from "../types/Currency"
import { ActiveRecord } from "./ActiveRecord"
import { Product } from "./Product"
import { Sale } from "./Sale"

export interface SaleProduct {
    saleId: Sale['id']
    productId: Product['id']
    assemblyGroup: number 
    quantity: number 
    discount: number 
    pricePerUnit: number 
    observations: string 
    currency: Currencies
}

class SaleProductRecord extends ActiveRecord<SaleProduct> {
    tableName = "saleProduct"

    public saleId: Sale['id']
    public productId: Product['id']
    public assemblyGroup: number 
    public quantity: number 
    public discount: number 
    public pricePerUnit: number 
    public observations: string 
    public currency: Currencies

    constructor(saleProduct?: Partial<SaleProduct>) {
        super()
        this.saleId = saleProduct?.saleId
        this.productId = saleProduct?.productId
        this.assemblyGroup = saleProduct?.assemblyGroup
        this.quantity = saleProduct?.quantity
        this.discount = saleProduct?.discount
        this.pricePerUnit = saleProduct?.pricePerUnit
        this.observations = saleProduct?.observations
        this.currency = saleProduct?.currency
    }
}

export default SaleProduct