import ActiveRecord from "./ActiveRecord.js";

class DetProSpe extends ActiveRecord {
    tableName = "DetProSpe";

    constructor(detail) {
        super();
        this.ProductListID = detail?.ProductListID;
        this.SpecificationID = detail?.SpecificationID;
        this.Value = detail?.Value;
    }
}

export default DetProSpe