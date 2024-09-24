import Customer from "../models/Customer.js"

const getAllCustomers = async(req, res) => {
    const customerObj = new Customer();
    const users = await customerObj.getAllTable('CustomerUserView')
    const customers = await customerObj.getAll();

    if(customers.length > 0) {
        for(let i=0;i<customers.length;i++) {
            const sqlDiscounts = `
                SELECT * FROM CustomerDiscount
                WHERE CustomerID = ${customers[i].ID}
            `
            const discounts = await customerObj.exectQueryInfo(sqlDiscounts);

            for(let j = 0; j<discounts.length;j++) {
                const sqlPercentages = `
                    SELECT * FROM CustomerPercentageDiscounts
                    WHERE DiscountID = ${discounts[j].ID}
                `
                discounts[j].Percentages = await customerObj.exectQueryInfo(sqlPercentages);
            }

            customers[i].Discounts = discounts

            const usersCustomer = users?.filter(user => user.CustomerID === customers[i].ID);
            customers[i].Users = usersCustomer;
        }
    }

    if(customers) {
        return res.status(200).json({
            status : 200, 
            msg : "Ok", 
            customers
        })
    } else {
        const error = new Error("Hubo un error")
        return res.status(500).json({status : 500, msg: error})
    }
}

const addNewCustomer = async(req, res) => {
    const { customer } = req.body;

    const customerObj = new Customer(customer);
    const existRfc = await customerObj.getByElement('RFC', customerObj.RFC);

    if(existRfc) {
        const error = new Error("Ya existe un cliente con el mismo RFC")
        return res.status(500).json({status : 500, msg: error})
    }

    const existBussinessName = await customerObj.getByElement('BusinessName', customerObj.BusinessName);

    if(existBussinessName) {
        const error = new Error("Ya existe un cliente con la misma razon social")
        return res.status(500).json({status : 500, msg: error})
    }

    const response = await customerObj.addOne(customerObj);

    if(response) {
        return res.status(200).json({
            status : 200, 
            msg: response.msg
        })
    } else {
        const error = new Error("Hubo un error")
        return res.status(500).json({status : 500, msg: error})
    }
}

const updateCustomer = async(req, res) => {
    const { customer } = req.body
    const customerObj = new Customer(customer)

    const response = await customerObj.updateOne(customerObj);

    if(response) {
        return res.status(200).json({
            status : 200, 
            msg: "Cliente actualizado correctamente"
        })
    } else {
        const error = new Error("Hubo un error")
        return res.status(500).json({status : 500, msg: error})
    }
}

export {
    getAllCustomers, 
    addNewCustomer, 
    updateCustomer
}