import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import useApp from '../hooks/useApp'
import Select from 'react-select'
import Scroll from './Scroll'
import ProductFormTr from './ProductFormTr'
import { v4 as uuidv4 } from 'uuid'
import formatearDinero from '../helpers/formatearDinero'

const ProductTableForm = ({ productsArray, setProductsArray, sale, setShow, setProductFolio, productFolio, discounts, onShow, searchBar = true }) => {
    const [addDiscounts, setAddDiscounts] = useState(false)
    const [productFolioObservation, setProductFolioObservation] = useState('')
    const { products, handleAddProduct } = useApp();

    const { id } = useParams();

    // Select
    const [selectedOption, setSelectedOption] = useState(null)

    const options = products.map(product => {
        const productNew = {
            value : product.Folio, 
            label : `${product.Folio} - ${product.Name}`
        }
    
        return productNew;
    })

    // Modificar select
    const handleSelectChange = (selected) => {
        setSelectedOption(selected)
        setProductFolio(selected.value);
    };

    // Agregar productos al arreglo
    const handleAddProductArray = (folio, assemblyFolio, assemblyGroup = null) => {
        const newArray = handleAddProduct(productsArray, folio, 1, assemblyFolio, assemblyGroup)
        setProductsArray({
            ...sale, 
            Products : newArray,
            products : newArray,
        })
    }

    const handleRemoveProductArray = (productID) => {
        const newArray = productsArray.filter(product => product.Folio !== productID)
        setProductsArray({
            ...sale, 
            Products : newArray, 
            products : newArray,
        })
    }

    const handleChangeInfo = (e, folio, assembly = '') => {
        const isNumber = ['Quantity', 'Percentage', 'PricePerUnit'].includes(e.target.name)
        let newArray = []
        if(assembly === '') {
            newArray = productsArray.map(product => product.Folio === folio ? {...product, [e.target.name] : isNumber ? +e.target.value : e.target.value} : product)
        } else {
            newArray = productsArray.map(product => product.Folio === folio && product.Assembly === assembly ? {...product, [e.target.name] : isNumber ? +e.target.value : e.target.value} : product)
        }

        setProductsArray({
            ...sale, 
            Products : newArray, 
            products : newArray,
        })
    }

    const subtotal = useMemo(() => sale?.Products?.reduce((total, product) => total + ((product.Quantity * product.PricePerUnit) - ((product.Discount / 100) * (product.Quantity * product.PricePerUnit))), 0), [sale])
    const iva = useMemo(() => subtotal * .16, [sale])
    const total = useMemo(() => subtotal + iva, [sale])

    return (
        <>
            {searchBar && (
                <div className="d-flex align-items-center gap-2">
                    <Select 
                        options={options} 
                        onChange={handleSelectChange} 
                        className="w-100"
                        value={selectedOption}
                    />
                    <div>
                        <button onClick={() => handleAddProductArray(productFolio)} type="button" className="btn bgPrimary text-nowrap">+ Agregar Producto</button>
                    </div>
                </div>
            )}

            <Scroll>
                <table className="table table-hover mt-2">
                    <thead className="table-light">
                        <tr>
                            <th>Folio</th>
                            <th>Nombre</th>
                            <th className='text-nowrap'>Precio U.</th>
                            <th>Stock</th>
                            <th>Cantidad</th>
                            <th className="text-nowrap" colSpan={2}>Descuento (%)</th>
                            <th>Importe</th>
                            <th>Ensamble</th>
                            <th colSpan={2}>Observaciones</th>
                            {(productsArray?.length > 1 || !id) && (
                                <th className='d-flex align-items-center'>
                                    Acciones

                                    {discounts?.length > 0 && (
                                        <button 
                                            className='btn-sm'
                                            onClick={onShow}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="iconTable text-warning">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>
                                        </button>
                                    )}
                                </th>
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {sale?.Products?.sort((a, b) => a.AssemblyGroup-b.AssemblyGroup).map(product => (
                            <ProductFormTr
                                key={uuidv4()}
                                setProductFolio={setProductFolio}
                                product={product}
                                sale={sale}
                                handleChangeInfo={handleChangeInfo}
                                handleAddProductArray={handleAddProductArray}
                                handleRemoveProductArray={handleRemoveProductArray}
                                setShow={setShow}
                                discounts={discounts}
                                addDiscount={addDiscounts}
                                productFolioObservation={productFolioObservation}
                                setProductFolioObservation={setProductFolioObservation}
                            /> 
                        ))}

                        <tr>
                            <td className='table-active' colSpan={8}></td>
                            <td colSpan={2} className='fw-bold'>Subtotal: </td>
                            <td colSpan={2} className='fw-bold'>{formatearDinero(+subtotal)}</td>
                        </tr>
                        <tr>
                            <td className='table-active' colSpan={8}></td>
                            <td colSpan={2} className='fw-bold'>IVA: </td>
                            <td colSpan={2} className='fw-bold'>{formatearDinero(+iva)}</td>
                        </tr>
                        <tr>
                            <td className='table-active' colSpan={8}></td>
                            <td colSpan={2} className='fw-bold'>Total: </td>
                            <td colSpan={2} className='fw-bold'>{formatearDinero(+total)}</td>
                        </tr>
                    </tbody>
                </table>
            </Scroll>
        </>
    )
}

export default ProductTableForm