import ActiveRecord from "./ActiveRecord.js";

class RequestProduct extends ActiveRecord {
    tableName = "RequestProduct"

    constructor(props) {
        super(props);
        this.RequestID = +props?.RequestID;
        this.ProductFolio = props?.ProductFolio;
        this.Assembly = props?.Assembly ?? null;
        this.AssemblyGroup = +props?.AssemblyGroup ?? null
        this.Quantity = +props?.Quantity;
        this.PricePerUnit = +props?.PricePerUnit;
        this.Discount = +props?.Discount ?? 0;
    }
}

export default RequestProduct