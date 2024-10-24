import { ActiveRecord } from "./ActiveRecord"

const classifications = {
    PRODUCT: 'product',
    accessory: 'accessory', 
    REFACTION: 'refaction'
} as const

export type Classifications = typeof classifications[keyof typeof classifications]

export interface Product {
    id?: string
    name: string
    description: string
    listPrice: number
    typeId: number 
    classification: Classifications
    stockAvaible: number 
    stockOnHand: number 
    stockOnWay: number 
    active: boolean
    minStock: number 
    maxStock: number 
}

class ProductRecord extends ActiveRecord<Product> {
    tableName = 'product'

    public id?: string
    public name: string
    public description: string
    public listPrice: number
    public typeId: number
    public classification: Classifications
    public stockAvaible: number
    public stockOnHand: number
    public stockOnWay: number
    public active: boolean
    public minStock: number
    public maxStock: number

    
    constructor(product?: Partial<Product>) {
        super()
        this.id = product?.id ?? null
        this.name = product?.name ?? ''
        this.description = product?.description ?? ''
        this.listPrice = product?.listPrice ?? 0
        this.typeId = product?.typeId ?? 0
        this.classification = product?.classification ?? 'product'
        this.stockAvaible = product?.stockAvaible ?? 0
        this.stockOnHand = product?.stockOnHand ?? 0
        this.stockOnWay = product?.stockOnWay ?? 0
        this.active = product?.active ?? true
        this.minStock = product?.minStock ?? 0
        this.maxStock = product?.minStock ?? 0
    }
}

export default ProductRecord