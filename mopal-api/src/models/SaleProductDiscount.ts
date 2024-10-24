import { ActiveRecord } from "./ActiveRecord"
import { Product } from "./Product"
import { Sale } from "./Sale"

interface SaleProductDiscount {
    discount: number 
    productId: Product['id']
    assemblyGroup: number 
    saleId: Sale['id']
}

class SaleProductDiscountRecord extends ActiveRecord<SaleProductDiscount> {
    tableName = "saleProductDiscount"

    public discount: number 
    public productId: Product['id']
    public assemblyGroup: number 
    public saleId: Sale['id']

    constructor(saleProductDiscount?: Partial<SaleProductDiscount>) {
        super()
        this.discount = saleProductDiscount?.discount ?? 0
        this.productId = saleProductDiscount?.productId
        this.assemblyGroup = saleProductDiscount?.assemblyGroup ?? null
        this.saleId = saleProductDiscount?.saleId
    }
}

export default SaleProductDiscount