import formatearFecha from "../helpers/formatearFecha.js";
import ActiveRecord from "./ActiveRecord.js";
import Product from "./Product.js";
import RequestProduct from "./RequestProduct.js";
import User from "./User.js";

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

    async getAllRequestInfo(userId) {
        let requests = await this.getAll();
        const requestActions = await this.getAllTable('RequestAction')
        const users = await new User().getAllUserInfo()

        if(userId) {
            requests = requests.filter(request => +request.UserID === +userId)
        }

        requests = requests.map(request => {
            const user = users.filter(user => user.ID === request.UserID)[0]

            const { ID, ...userCopy } = user

            return {
                ...request, 
                ...userCopy,
                Action: requestActions.filter(action => action.ID === request.ActionID)[0].Name,
                UserFullName: user.Name + ' ' + user.LastName,
            }
        })

        return requests
    }

    async getRequestByID(id) {
        let request = await this.getByID(id);
        const requestActions = await this.getAllTable('RequestAction')
        const users = await new User().getAllUserInfo()

        const user = users.filter(user => user.ID === request.UserID)[0]

        const { ID, ...userCopy } = user

        return {
            ...request, 
            ...userCopy,
            Action: requestActions.filter(action => action.ID === request.ActionID)[0].Name,
            UserFullName: user.Name + ' ' + user.LastName,
        }
    }

    async getRequestProductInfo(requestId) {
        let requestProducts = await new RequestProduct().getAll()
        const products = await new Product().getAllProductInfo()

        if(requestId) {
            requestProducts = requestProducts.filter(request => request.RequestID === requestId)
        }

        for(let i=0;i<requestProducts.length;i++) {
            const product = products.filter(product => product.Folio === requestProducts[i].ProductFolio)[0];
            
            requestProducts[i] = {
                ...requestProducts[i], 
                ...product
            }
        }

        return requestProducts
    }
}

export default Request