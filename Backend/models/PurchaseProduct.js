import ActiveRecord from "./ActiveRecord.js";

class PurchaseProduct extends ActiveRecord {
    tableName = "PurchaseProduct"

    constructor(purchaseProduct) {
        super();
        this.PurchaseFolio = purchaseProduct?.PurchaseFolio;
        this.ProductFolio = purchaseProduct?.ProductFolio;
        this.Assembly = purchaseProduct?.Assembly ?? null;
        this.AssemblyGroup = purchaseProduct?.AssemblyGroup ?? 0;
        this.Quantity = purchaseProduct?.Quantity;
        this.Discount = purchaseProduct?.Discount ?? '0';
        this.PricePerUnit = purchaseProduct?.PricePerUnit;
        this.Observations = purchaseProduct?.Observations ?? '';
        this.CurrencyId = purchaseProduct?.CurrencyId ?? 1;
    }
}

export default PurchaseProduct