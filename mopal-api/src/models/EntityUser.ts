import { ActiveRecord } from "./ActiveRecord"
import { Entity } from "./Entity"
import { User } from "./User"

interface EntityUser {
    userId: User['id'] 
    entityId: Entity['id']
}

class EntityUserRecord extends ActiveRecord<EntityUser> {
    tableName = 'entityUser'

    public userId: User['id']  
    public entityId: Entity['id'] 

    constructor(entityUser?: Partial<EntityUser>) {
        super()
        this.userId = entityUser?.userId
        this.entityId = entityUser?.entityId
    }
}

export default EntityUserRecord