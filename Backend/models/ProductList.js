import ActiveRecord from "./ActiveRecord.js";

class ProductList extends ActiveRecord {
     tableName = "ProductList"

     constructor(productList) {
        super();
        this.ID = productList?.ID
        this.Name = productList?.Name
        this.TypeID = productList?.TypeID
        this.ClassificationID = productList?.ClassificationID
        this.ImageHeaderURL = productList?.ImageHeaderURL ?? ''
        this.ImageIconURL = productList?.ImageIconURL ?? ''
     }
}

export default ProductList