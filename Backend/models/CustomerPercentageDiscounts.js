import ActiveRecord from "./ActiveRecord.js";

class CustomerPercentageDiscounts extends ActiveRecord {
    tableName = "CustomerPercentageDiscounts"

    constructor(item) {
        super()
        this.DiscountID = item?.DiscountID
        this.Percentage = item?.Percentage
    }
}

export default CustomerPercentageDiscounts