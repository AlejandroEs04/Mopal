import ActiveRecord from "./ActiveRecord.js";

class PurchaseProductDiscount extends ActiveRecord {
    tableName = "PurchaseProductDiscount"

    constructor(props) {
        super();
        this.Discount = props?.Discount;
        this.ProductID = props?.ProductID;
        this.AssemblyGroup = props?.AssemblyGroup === '' ? 0 : props?.AssemblyGroup;
        this.PurchaseID = props?.PurchaseID;
    }
}

export default PurchaseProductDiscount;