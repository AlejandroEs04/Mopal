import ActiveRecord from "./ActiveRecord.js";
import Classification from "./Classification.js";
import DetProAcc from "./DetProAcc.js";
import Type from "./Type.js";

class Product extends ActiveRecord {
    tableName = 'Product';

    constructor(product) {
        super();
        this.Folio = product?.Folio;
        this.Name = product?.Name;
        this.Description = product?.Description;
        this.ListPrice = product?.ListPrice;
        this.TypeID = product?.TypeID;
        this.ClassificationID = product?.ClassificationID;
        this.StockAvaible = product?.StockAvaible;
        this.MaxStock = product?.MaxStock;
        this.MinStock = product?.MinStock;
        this.StockOnHand = product?.StockOnHand ?? 0;
        this.StockOnWay = product?.StockOnWay ?? 0;
        this.Active = product?.Active ?? 1;
    }

    async getAllProductInfo() {
        const products = await this.getAll()
        const classifications = await new Classification().getAll()
        const types = await new Type().getAll()
        const productsAccesories = await new DetProAcc().getAll()

        for(let i=0;i<products.length;i++) {
            let accessories = productsAccesories.filter(accessory => accessory.ProductFolio === products[i].Folio)
    
            accessories = accessories.map(accessory => {
                const product = products.filter(product => product.Folio === accessory.AccessoryFolio)[0]
                return {
                    ...accessory, 
                    Folio: accessory.AccessoryFolio, 
                    Name: product.Name,
                    Description: product.Description,
                    ListPrice: +product.ListPrice,
                    Name: product.Name,
                    Active: product.Active,
                    Type: types.filter(type => +type.ID === +product.TypeID)[0].Name, 
                    Classification: classifications.filter(classification => +classification.ID === +product.ClassificationID)[0].Name
                }
            })
    
            products[i] = {
                ...products[i], 
                Type: types.filter(type => +type.ID === +products[i].TypeID)[0].Name, 
                Classification: classifications.filter(classification => +classification.ID === +products[i].ClassificationID)[0].Name, 
                accessories
            }
        }

        return products
    }

    async getByFolioProductInfo(folio) {
        let product = await this.getByFolio(folio)
        const products = await this.getAll()
        const classifications = await new Classification().getAll()
        const types = await new Type().getAll()
        const productsAccesories = await new DetProAcc().getAll()

        let accessories = productsAccesories.filter(accessory => accessory.ProductFolio === product.Folio)
    
        accessories = accessories.map(accessory => {
            const product = products.filter(product => product.Folio === accessory.AccessoryFolio)[0]
                return {
                    ...accessory, 
                    Folio: accessory.AccessoryFolio, 
                    Name: product.Name,
                    Description: product.Description,
                    ListPrice: +product.ListPrice,
                    Name: product.Name,
                    Active: product.Active,
                    Type: types.filter(type => +type.ID === +product.TypeID)[0].Name, 
                Classification: classifications.filter(classification => +classification.ID === +product.ClassificationID)[0].Name
            }
        })
    
        product = {
            ...product, 
            Type: types.filter(type => +type.ID === +product.TypeID)[0].Name, 
            Classification: classifications.filter(classification => +classification.ID === +product.ClassificationID)[0].Name
        }

        return product
    }
}

export default Product;