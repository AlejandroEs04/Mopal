import ActiveRecord from "./ActiveRecord.js";

class PendingRequest extends ActiveRecord {
    tableName = 'pendingRequest'

    constructor(item) {
        super();
        this.userId = item?.userId
        this.action = item?.action
        this.productData = item?.productData ?? {}
        this.status = item?.status ?? 'pending'
    }
}

export default PendingRequest