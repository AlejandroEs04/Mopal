import ActiveRecord from "./ActiveRecord.js";
import Rol from "./Rol.js";
import CustomerUser from "./CustomerUser.js";
import SupplierUser from "./SupplierUser.js";

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

    async getAllUserInfo() {
        const users = await this.getAll()
        const rols = await new Rol().getAll()
        const customerUsers = await new CustomerUser().getAll()
        const supplierUsers = await new SupplierUser().getAll()

        for(let i=0;i<users.length;i++) {
            const customer = customerUsers.filter(userC => +userC.UserID === +users[i].ID)[0]
            const supplier = supplierUsers.filter(userS => +userS.UserID === +users[i].ID)[0]
            
            users[i] = {
                ...users[i], 
                RolName: rols.filter(rol => rol.ID === users[i].RolID)[0].Name, 
                FullName: users[i].Name + ' ' + users[i].LastName,
                CustomerID: customer ? customer.CustomerID : null,
                SupplierID: supplier ? supplier.SupplierID : null
            }
        }

        return users
    }

    async getUserByID(id) {
        let user = await this.getByID(id)
        const rols = await new Rol().getAll()
        const customerUsers = await new CustomerUser().getAll()
        const supplierUsers = await new SupplierUser().getAll()

        const customer = customerUsers.filter(userC => +userC.UserID === +user.ID)[0]
        const supplier = supplierUsers.filter(userS => +userS.UserID === +user.ID)[0]
        
        user = {
            ...user, 
            RolName: rols.filter(rol => rol.ID === user.RolID)[0].Name, 
            CustomerID: customer ? customer.CustomerID : null,
            SupplierID: supplier ? supplier.SupplierID : null
        }
        
        return user
    }
}

export default User;