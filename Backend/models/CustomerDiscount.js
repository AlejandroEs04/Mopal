import ActiveRecord from "./ActiveRecord.js";

class CustomerDiscount extends ActiveRecord {
    tableName = "CustomerDiscount";

    constructor(item) {
        super();
        this.ID = item?.ID;
        this.PercentageTotal = item?.PercentageTotal;
        this.CustomerID = item?.CustomerID;
        this.Favorite = item?.Favorite ?? 0;
    }
}

export default CustomerDiscount