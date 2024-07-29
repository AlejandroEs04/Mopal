import ActiveRecord from "./ActiveRecord.js";

class PurchaseProduct extends ActiveRecord {
    tableName = "PurchaseProduct"

    constructor(purchaseProduct) {
        super();
        this.PurchaseFolio = purchaseProduct?.PurchaseFolio;
        this.ProductFolio = purchaseProduct?.ProductFolio;
        this.Assembly = purchaseProduct?.Assembly ?? '';
        this.AssemblyGroup = purchaseProduct?.AssemblyGroup ?? '';
        this.Quantity = purchaseProduct?.Quantity;
        this.Discount = purchaseProduct?.Discount ?? 0;
        this.PricePerUnit = purchaseProduct?.PricePerUnit;
        this.Observations = purchaseProduct?.Observations ?? '';
    }
}

export default PurchaseProduct