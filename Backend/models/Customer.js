import ActiveRecord from "./ActiveRecord.js";

class Customer extends ActiveRecord {
    tableName = "Customer"

    constructor(customer) {
        super();
        this.ID = customer?.ID;
        this.BusinessName = customer?.BusinessName;
        this.Address = customer?.Address;
        this.RFC = customer?.RFC;
        this.Email = customer?.Email;
    }
}

export default Customer;