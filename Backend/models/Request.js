import formatearFecha from "../helpers/formatearFecha.js";
import ActiveRecord from "./ActiveRecord.js";

class Request extends ActiveRecord {
    tableName = "Request";

    constructor(request) {
        super();
        this.ID = request?.ID;
        this.UserID = request?.UserID;
        this.Status = request?.Status ?? 1;
        this.CreationDate = request?.CreationDate ?? formatearFecha(Date.now());
        this.ActionID = request?.actionID;
    }
}

export default Request