import ActiveRecord from "./ActiveRecord.js";

class Product extends ActiveRecord {
    tableName = 'Product';

    constructor(product) {
        super();
        this.Folio = product?.Folio;
        this.Name = product?.Name;
        this.Description = product?.Description;
        this.ListPrice = product?.ListPrice;
        this.TypeID = product?.TypeID;
        this.ClassificationID = product?.ClassificationID;
        this.StockAvaible = product?.StockAvaible;
        this.MaxStock = product?.MaxStock;
        this.MinStock = product?.MinStock;
        this.StockOnHand = product?.StockOnHand ?? 0;
        this.StockOnWay = product?.StockOnWay ?? 0;
        this.Active = product?.Active ?? 1;
    }
}

export default Product;