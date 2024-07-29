import { useEffect, useState } from 'react';
import useAdmin from '../hooks/useAdmin'
import formatearDinero from '../helpers/formatearDinero';

const ProductDiscountTr = ({ supplier, product, updatingArray, setUpdatingArray }) => {
    const [exists, setExists] = useState(false)
    const [edit, setEdit] = useState(false)
    const [discount, setDiscount] = useState(0)
    const [discountID, setDiscountID] = useState(0);
    const { discounts } = useAdmin();

    const handleChange = (e) => {
        const { value } = e.target
        setDiscountID(value)
    }

    useEffect(() => {
        const discount = discounts?.filter(discount => discount.ID === +discountID)[0];
        
        if(discount) {
            if((!exists && +discount.PercentageTotal > 0) || !exists) {
                const existsInsideArray = updatingArray.filter(productArray => productArray.ProductFolio === product.Folio)

                if(existsInsideArray.length > 0) {
                    const newArray = updatingArray?.map(productArray => productArray.ProductFolio === product.Folio ? {
                        ProductFolio: product.Folio, 
                        SupplierID: supplier.ID, 
                        DiscountID: discount.ID
                    } : productArray)

                    setUpdatingArray(newArray)
                } else {
                    setUpdatingArray([
                        ...updatingArray, 
                        {
                            ProductFolio : product.Folio, 
                            DiscountID : discount.ID, 
                            SupplierID : supplier.ID
                        }
                    ])
                }

                setEdit(true)
            }

            setDiscount(+discount.PercentageTotal)
        } else {
            const newArray = updatingArray.filter(productArray => productArray.ProductFolio !== product.Folio)
            setUpdatingArray(newArray)

            setEdit(false)
            setDiscount(0)
        }
    }, [discountID])

    useEffect(() => {
        if(supplier.Discounts.length > 0) {
            const isExist = supplier.Discounts.filter(discount => discount.ProductFolio === product.Folio)

            if(isExist.length > 0) {
                setExists(true)
                setDiscountID(isExist[0].DiscountID)
            }
        }
    }, [supplier])

    return (
        <tr>
            <td>{product.Folio}</td>
            <td>
                <div className='d-flex gap-2'>
                    <select 
                        name="Discount" 
                        id="discount"
                        className='form-select form-select-sm'
                        onChange={handleChange}
                        value={discountID}
                        disabled={exists}
                    >
                        <option value="0">0%</option>
                        {discounts?.map(discount => (
                            <option key={discount.ID} value={discount.ID}>{discount.PercentageTotal}% | {discount.percentages?.map(discount => `+${(+discount.Percentage).toFixed(0)}`)}</option>
                        ))}
                    </select>
                </div>
            </td>
            <td>{formatearDinero(+product.ListPrice)}</td>
            <td>{formatearDinero(+(product.ListPrice - (product.ListPrice * +discount / 100)).toFixed(3))}</td>
            <td>
                <div className='d-flex align-items-center'>
                    <div 
                        className={`
                            circle
                            ${edit ? 'bg-warning' : exists ? 'bg-success' : 'bg-danger' }
                        `}
                    ></div>
                </div>
            </td>
        </tr>
    )
}

export default ProductDiscountTr