import ActiveRecord from "./ActiveRecord.js";

class DetProAcc extends ActiveRecord {
    tableName = "DetProAcc"

    constructor(accesory) {
        super();
        this.ProductFolio = accesory?.ProductFolio
        this.AccessoryFolio = accesory?.AccessoryFolio
        this.Piece = accesory?.Piece ?? null
        this.QuantityPiece = accesory?.Quantity ?? null
    }
}

export default DetProAcc