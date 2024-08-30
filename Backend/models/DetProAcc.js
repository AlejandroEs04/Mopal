import ActiveRecord from "./ActiveRecord.js";

class DetProAcc extends ActiveRecord {
    tableName = "DetProAcc"

    constructor(accesory) {
        super();
        this.ProductFolio = accesory?.ProductFolio
        this.AccessoryFolio = accesory?.AccessoryFolio
        this.Piece = accesory?.Piece ?? 0
        this.QuantityPiece = accesory?.Quantity ?? 0
    }
}

export default DetProAcc