import ActiveRecord from "./ActiveRecord.js";

class User extends ActiveRecord {
    tableName = 'User';

    constructor(user) {
        super();
        this.ID = user?.ID;
        this.UserName = user?.UserName;
        this.Password = user?.Password;
        this.Name = user?.Name;
        this.LastName = user?.LastName;
        this.Email = user?.Email ?? "";
        this.Number = user?.Number ?? "";
        this.RolID = user?.RolID;
        this.Active = user?.Active ?? true;
        this.Address = user?.Address ?? "";
    }
}

export default User;