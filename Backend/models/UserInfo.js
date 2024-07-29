import ActiveRecord from "./ActiveRecord.js";

class UserInfo extends ActiveRecord {
    tableName = "UserInfo";

    constructor(userInfo) {
        super();
        this.ID = userInfo?.ID;
        this.UserName = userInfo?.UserName;
        this.FullName = userInfo?.FullName;
        this.Email = userInfo?.Email;
        this.Number = userInfo?.Number;
        this.RolID = userInfo?.RolID;
        this.Rol = userInfo?.Rol;
        this.Active = userInfo?.Active;
    }
}

export default UserInfo;