import ActiveRecord from "./ActiveRecord.js";

class CustomerUser extends ActiveRecord {
    tableName = "CustomerUser";

    constructor(user) {
        super();
        this.UserID = user?.UserID;
        this.CustomerID = user?.CustomerID;
    }
}

export default CustomerUser