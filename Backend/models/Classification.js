import ActiveRecord from "./ActiveRecord.js";

class Classification extends ActiveRecord {
    tableName = 'Classification';

    constructor(classification) {
        super();
        this.ID = classification?.ID;
        this.Name = classification?.Name;
    }
}

export default Classification;