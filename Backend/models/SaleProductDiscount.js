import ActiveRecord from "./ActiveRecord.js";

class SaleProductDiscount extends ActiveRecord {
    tableName = "SaleProductDiscount"

    constructor(props) {
        super();
        this.Discount = props?.Discount;
        this.ProductID = props?.ProductID;
        this.AssemblyGroup = props?.AssemblyGroup === '' ? 0 : props?.AssemblyGroup;
        this.SaleID = props?.SaleID;
    }
}   

export default SaleProductDiscount