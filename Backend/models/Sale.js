import ActiveRecord from "./ActiveRecord.js";

class Sale extends ActiveRecord {
    tableName = 'Sale';

    constructor(sale) {
        super();
        this.Folio = sale?.Folio;
        this.SaleDate = sale?.SaleDate ?? Date.now;
        this.CustomerID = sale?.CustomerID;
        this.CustomerUserID = sale?.CustomerUserID ?? null;
        this.CurrencyID = sale?.CurrencyID ?? 1;
        this.StatusID = sale?.StatusID ?? 1;
        this.UserID = sale?.UserID;
        this.Amount = sale?.Amount;
        this.Active = sale?.Active ?? true;
        this.Observation = sale?.Observation ?? "";
    }
}

export default Sale