import { PendingRequetsStatus } from "../types/Status"
import { ActiveRecord } from "./ActiveRecord"
import { User } from "./User"

const actions = {
    CREATE: 'create', 
    UPDATE: 'update', 
    DELETE: 'delete'
} as const 

export type Actions = typeof actions[keyof typeof actions]

interface PendingRequets {
    id: number
    userId: User['id']
    action: Actions
    productData: JSON
    status: PendingRequetsStatus
    createdAt: string
}

class PendingRequetsRecord extends ActiveRecord<PendingRequets> {
    tableName = "pendingRequest"

    public id: number
    public userId: User['id']
    public action: Actions
    public productData: JSON
    public status: PendingRequetsStatus
    public createdAt: string

    constructor(pendingRequest?: Partial<PendingRequets>) {
        super()
        this.id = pendingRequest?.id ?? null
        this.userId = pendingRequest?.userId
        this.action = pendingRequest?.action
        this.userId = pendingRequest?.userId
        this.userId = pendingRequest?.userId
    }
}

export default PendingRequetsRecord