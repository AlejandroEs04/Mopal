import ActiveRecord from "./ActiveRecord.js";

class Type extends ActiveRecord {
    tableName = 'Type';

    constructor(type) {
        super();
        this.ID = type?.ID;
        this.Name = type?.Name;
        this.Description = type?.Description;
    }
}

export default Type