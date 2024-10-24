import { Currencies } from "../types/Currency"
import { PurchaseStatus } from "../types/Status"
import { ActiveRecord } from "./ActiveRecord"
import { Entity } from "./Entity"
import { User } from "./User"

export interface Purchase {
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

class PurchaseRecord extends ActiveRecord<Purchase> {
    tableName = "purchase"

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

    constructor(purchase?: Partial<Purchase>) {
        super()
        this.id = purchase?.id ?? null
        this.createdAt = purchase?.createdAt ?? ''
        this.updatedAt = purchase?.updatedAt ?? ''
        this.entityId = purchase?.entityId
        this.currency = purchase?.currency ?? 'usd'
        this.status = purchase?.status ?? 'generated'
        this.userId = purchase?.userId
        this.amount = purchase?.amount ?? 0
        this.active = purchase?.active ?? true
        this.entityUserId = purchase?.entityUserId
        this.externalObservation = purchase?.externalObservation ?? ''
        this.internObservation = purchase?.internObservation ?? ''
    }
}

export default PurchaseRecord