import ActiveRecord from "./ActiveRecord.js";

class Rol extends ActiveRecord {
    tableName = "Rol"

    constructor(rol) {
        super();
        this.ID = rol?.ID;
        this.Name = rol?.Name;
    }
}

export default Rol