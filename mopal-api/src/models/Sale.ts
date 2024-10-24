import { Currencies } from "../types/Currency"
import { PurchaseStatus } from "../types/Status"
import { ActiveRecord } from "./ActiveRecord"
import { Entity } from "./Entity"
import { User } from "./User"

export interface Sale {
    id?: number 
    createdAt: string 
    updatedAt: string 
    entityId: Entity['id'] 
    currency: Currencies
    status: PurchaseStatus
    userId: User['id']
    amount: number 
    active: boolean
    entityUserId: User['id']
    externalObservation: string
    internObservation: string
}

class SaleRecord extends ActiveRecord<Sale> {
    tableName = 'sale'

    public id?: number 
    public createdAt: string 
    public updatedAt: string 
    public entityId: Entity['id'] 
    public currency: Currencies
    public status: PurchaseStatus
    public userId: User['id']
    public amount: number 
    public active: boolean
    public entityUserId: User['id']
    public externalObservation: string
    public internObservation: string

    constructor(sale?: Partial<Sale>) {
        super()
        this.id = sale?.id ?? null
        this.createdAt = sale?.createdAt ?? ''
        this.updatedAt = sale?.updatedAt ?? ''
        this.entityId = sale?.entityId
        this.currency = sale?.currency ?? 'usd'
        this.status = sale?.status ?? 'generated'
        this.userId = sale?.userId
        this.amount = sale?.amount ?? 0
        this.active = sale?.active ?? true
        this.entityUserId = sale?.entityUserId
        this.externalObservation = sale?.externalObservation ?? ''
        this.internObservation = sale?.internObservation ?? ''
    }
}

export default SaleRecord