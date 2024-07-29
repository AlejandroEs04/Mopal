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
        this.Percentage = +props?.Percentage ?? 100;
    }
}

export default RequestProduct