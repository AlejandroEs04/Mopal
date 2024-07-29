import { useEffect, useState } from "react"
import formatearDinero from "../helpers/formatearDinero"

const RequestInfoTr = ({ product, request, setRequest, setEdited }) => {
    const [percentage, setPercentage] = useState(product.Percentage)
    const [pricePerUnit, setPricePerUnit] = useState(+product.PricePerUnit === 0 ? product.ListPrice : product.PricePerUnit)

    console.log(product)

    const handleChange = (folio, e) => {
        const products = request.Products.map(product => product.ProductFolio === folio ? {
            ...product, 
            [e.target.name] : e.target.value 
        } : product )

        if(e.target.name === 'Percentage') {
            setPercentage(e.target.value)
        } else {
            setPricePerUnit(e.target.value)
        }

        request.Products = products

        setRequest(request)
        
        setEdited(true)
    }

    return (
        <>
            <tr key={product.ProductFolio}>
                <td className="text-nowrap">{product.ProductFolio}</td>
                <td className="text-nowrap">{product.ProductName}</td>
                <td>{product.Quantity}</td>
                <td>{product.StockAvaible}</td>
                <td className="text-nowrap">{product.AssemblyGroup === 0 ? 'N/A' : product.AssemblyGroup}</td>
                <td>
                    <input 
                        type="number" 
                        name="PricePerUnit" 
                        id="PricePerUnit" 
                        disabled={request?.Status !== 1}
                        value={pricePerUnit}
                        className="form-control form-control-sm" 
                        onChange={e => handleChange(product.ProductFolio, e)}
                    />
                </td>
                <td>
                    <input 
                        type="number" 
                        name="Percentage" 
                        id="percentageProduct" 
                        disabled={request?.Status !== 1}
                        value={percentage} 
                        className="form-control form-control-sm" 
                        onChange={e => handleChange(product.ProductFolio, e)}
                    />
                </td>
                <td>{formatearDinero((pricePerUnit) * product.Quantity)}</td>
            </tr>
        </>
    )
}

export default RequestInfoTr