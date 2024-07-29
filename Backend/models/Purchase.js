import ActiveRecord from "./ActiveRecord.js";

class Purchase extends ActiveRecord {
    tableName = "Purchase"

    constructor(purchase) {
        super();
        this.Folio = purchase?.Folio;
        this.PurchaseDate = purchase?.PurchaseDate ?? Date.now; 
        this.SupplierID = purchase?.SupplierID;
        this.SupplierUserID = purchase?.SupplierUserID;
        this.CurrencyID = purchase?.CurrencyID ?? 1; 
        this.StatusID = purchase?.StatusID ?? 1;
        this.UserID = purchase?.UserID;
        this.Amount = purchase?.Amount;
        this.Active = purchase?.Active ?? true;
        this.Observation = purchase?.Observation ?? "";
    }
}

export default Purchase;