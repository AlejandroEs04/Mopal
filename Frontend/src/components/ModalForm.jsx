import { useState } from 'react'
import Select from 'react-select'
import formatearDinero from '../helpers/formatearDinero'

const ModalForm = ({ 
    discounts, 
    setDiscount, 
    discount, 
    action, 
    handleModalDiscount 
}) => {
    const [selectedDiscountOption, setSelectedDiscountOption] = useState(null)

    const discountOptions = discounts.map(discount => {
        const discountNew = {
            value : discount.ID, 
            label : `${discount.PercentageTotal}% | ${discount.Percentages.map(percentage => `+${(+percentage.Percentage).toFixed(0)}`)}`
        }

        return discountNew;
    })

    const handleDiscountSelectChange = (selected) => {
        setDiscount(selected.value)
        setSelectedDiscountOption(selected)
    }

    return (
        <div>
            <div>
                <label>Seleccione un descuento</label>
                <Select 
                    options={discountOptions} 
                    onChange={handleDiscountSelectChange} 
                    value={selectedDiscountOption}
                    className="w-100"
                />
            </div>

            <table className="table mt-2">
                <thead>
                    <tr>
                        <th>Activar descuento</th>
                        <th>Folio</th>
                        <th>Precio Lista</th>
                        <th>Descuento Actual</th>
                        <th>Importe total</th>
                    </tr>
                </thead>

                <tbody>
                    {action.Products.map(product => (
                        <tr>
                            <td><input type="checkbox" disabled={!discount} onChange={e => handleModalDiscount(e, product.Folio, product.AssemblyGroup)} name="DiscountProduct" id="discountProduct" /></td>
                            <td>{product.ProductFolio}</td>
                            <td>{formatearDinero(product.PricePerUnit)}</td>
                            <td>{product.Discount}%</td>
                            <td>{formatearDinero(+(product.PricePerUnit) - ((product.PricePerUnit) * (product.Discount/100)))}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ModalForm