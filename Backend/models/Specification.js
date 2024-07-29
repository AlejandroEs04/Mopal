import ActiveRecord from "./ActiveRecord.js"

class Specification extends ActiveRecord {
    tableName = 'Specification';

    constructor(specification) {
        super();
        this.ID = specification?.ID; 
        this.Name = specification?.Name;
    }
}

export default Specification;