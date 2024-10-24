import { ActiveRecord } from "./ActiveRecord"

const roles = {
    ADMINISTRATOR: 'administrator',
    PURCHASING: 'purchasing', 
    SALES: 'sales', 
    DELIVERY: 'delivery', 
    MANAGMENT: 'managment', 
    USER: 'user'
} as const

export type Roles = typeof roles[keyof typeof roles]

export interface User {
    id: number
    userName: string
    password: string
    name: string
    lastName: string
    email: string
    number: string
    rol: Roles
    active: boolean
    address: string
}

class UserRecord extends ActiveRecord<User> {
    tableName = 'user'

    public id?: number
    public userName: string
    public password: string
    public name: string
    public lastName: string
    public email: string
    public number: string
    public rol: Roles
    public active: boolean
    public address: string
    
    constructor(user?: Partial<User>) {
        super()
        this.id = user?.id ?? null
        this.userName = user?.userName ?? ''
        this.password = user?.password ?? ''
        this.name = user?.name ?? ''
        this.lastName = user?.lastName ?? ''
        this.email = user?.email ?? ''
        this.number = user?.number ?? ''
        this.rol = user?.rol ?? 'user'
        this.active = user?.active ?? true
        this.address = user?.address ?? ''
    }
}

export default UserRecord