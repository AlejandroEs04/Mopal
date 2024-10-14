import ActiveRecord from "./ActiveRecord.js";

class Observation extends ActiveRecord {
    tableName = 'observation'

    static validActions = ['sale', 'purchase', 'quotation', 'request', 'all'];
    static validTypes = ['internal', 'external', 'all'];

    constructor(item) {
        super();
        this.id = item?.id;
        this.description = item?.description;
        this.action = Observation.validActions.includes(item?.action) ? item.action : 'all';
        this.type = Observation.validTypes.includes(item?.type) ? item.type : 'all';
    }
}

export default Observation