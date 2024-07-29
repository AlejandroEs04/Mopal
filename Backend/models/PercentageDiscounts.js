import ActiveRecord from "./ActiveRecord.js";

class PercentageDiscounts extends ActiveRecord {
    tableName = "PercentageDiscounts"

    constructor(percentage) {
        super();
        this.DiscountID = percentage?.DiscountID;
        this.Percentage = percentage?.Percentage
    }
}

export default PercentageDiscounts