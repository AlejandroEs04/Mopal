import ActiveRecord from "./ActiveRecord.js";

class RequestProductDiscount extends ActiveRecord {
    tableName = "RequestProductDiscount"

    constructor(props) {
        super();
        this.Discount = props?.Discount;
        this.ProductID = props?.ProductID;
        this.AssemblyGroup = props?.AssemblyGroup === '' ? 0 : props?.AssemblyGroup;
        this.RequestID = props?.RequestID;
    }
}   

export default RequestProductDiscount