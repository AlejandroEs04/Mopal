import ActiveRecord from "./ActiveRecord.js";

class SaleProduct extends ActiveRecord {
    tableName = "SaleProduct"

    constructor(saleProduct) {
        super();
        this.SaleFolio = saleProduct?.SaleFolio;
        this.ProductFolio = saleProduct?.ProductFolio;
        this.Assembly = saleProduct?.Assembly ?? '';
        this.AssemblyGroup = saleProduct?.AssemblyGroup ?? 0;
        this.Quantity = saleProduct?.Quantity;
        this.Discount = saleProduct?.Discount ?? 0;
        this.PricePerUnit = saleProduct?.PricePerUnit;
        this.Observations = saleProduct?.Observations ?? '';
        this.CurrencyId = saleProduct?.CurrencyId ?? 1;
    }
}

export default SaleProduct