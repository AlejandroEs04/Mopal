import ActiveRecord from "./ActiveRecord.js";

class SupplierUser extends ActiveRecord {
    tableName = "SupplierUser";

    constructor(user) {
        super();
        this.UserID = user?.UserID;
        this.SupplierID = user?.SupplierID;
    }
}

export default SupplierUser;