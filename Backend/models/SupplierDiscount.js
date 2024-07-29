import ActiveRecord from "./ActiveRecord.js";

class SupplierDiscount extends ActiveRecord {
    tableName = 'SupplierDiscount';

    constructor(discount) {
        super();
        this.ID = discount?.ID;
        this.PercentageTotal = discount?.PercentageTotal;
        this.SupplierID = discount?.SupplierID;
        this.Favorite = discount?.Favorite ?? 0;
    }
}

export default SupplierDiscount