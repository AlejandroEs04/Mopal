import { useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Scroll from './Scroll'
import Select from 'react-select'
import styles from '../styles/ProductTable.module.css'
import formatearDinero from '../helpers/formatearDinero'
import { getTotalsDiscount } from '../helpers/getValues'
import useApp from '../hooks/useApp'
import discountsAvaible from '../data/discounts'
import { v4 as uuidv4 } from 'uuid'
import AdminModal from './AdminModal'

const ProductTableView = ({
    searchBar = false, 
    action = [], 
    setAction, 
    discounts = [], 
    setShow, 
    setDeleteProductId, 
    setDeleteProductGroup, 
    showDeletePop
}) => {
    const [selectedOption, setSelectedOption] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [product, setProduct] = useState({})
    const [accesoryId, setAccessoryId] = useState('')
    const [discount, setDiscount] = useState(0)
    const [newProductAcount, setNewProductAcount] = useState(0)
    const { products, handleGenerateProduct } = useApp();

    const options = products.map(product => {
        const productNew = {
            value : product.Folio, 
            label : `${product.Folio} - ${product.Name}`
        }
    
        return productNew;
    })

    const handleSelectChange = (selected) => {
        setSelectedOption(selected)
    };

    const handleAddProductList = (id, assemblyFolio = '', assemblyGroup = null) => {
        const product = handleGenerateProduct(action.Products, id, 1, assemblyFolio, assemblyGroup)
        
        if(product) 
            setAction({
                ...action, 
                Products: [
                    ...action.Products, 
                    product
                ]
            })
    }

    const handleAddDiscount = (id, group) => {
        const products = action.Products.map(product => product.Folio === id && product.AssemblyGroup === group ? { 
            ...product, 
            Discounts: [ ...product.Discounts, {Discount: discount, id: uuidv4()} ]
        } : product)

        const productsDiscount = products.map(product => product.Folio === id && product.AssemblyGroup === group ? { 
            ...product, 
            Discount: +((1 - product.Discounts.reduce((total, discount) => total * (1 - (+discount.Discount/100)), 1)) * 100).toFixed(2)
        } : product)

        setNewProductAcount(newProductAcount + 1)
        
        setDiscount(0)

        setAction({
            ...action, 
            Products: productsDiscount
        })

    }

    const handleRemoveDiscount = (id, group, discountId) => {
        const products = action.Products.map(product => product.Folio === id && product.AssemblyGroup === group ? {
            ...product, 
            Discounts: product.Discounts.filter(discount => discount.id !== discountId)
        } : product)

        const productsDiscount = products.map(product => product.Folio === id && product.AssemblyGroup === group ? { 
            ...product, 
            Discount: +((1 - product.Discounts.reduce((total, discount) => total * (1 - (+discount.Discount/100)), 1)) * 100).toFixed(2)
        } : product)

        setAction({
            ...action, 
            Products: productsDiscount
        })
    }

    const handleChange = (e, id, group) => {
        const { name, value } = e.target
        const isNumber = ['quantity'].includes(name)

        const products = action.Products.map(product => product.Folio === id && product.AssemblyGroup === group ? { 
            ...product, [name] : isNumber ? +value : value 
        } : product)

        setAction({
            ...action,
            Products: products 
        })
    }

    const subtotal = useMemo(() => action?.Products?.reduce((total, product) => total + ((product.Quantity * product.PricePerUnit) - ((product.Discount / 100) * (product.Quantity * product.PricePerUnit))), 0), [action.Products])
    const iva = useMemo(() => subtotal * .16, [action.Products])
    const total = useMemo(() => subtotal + iva, [action.Products])

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
                        <button onClick={() => handleAddProductList(selectedOption.value)} type="button" className="btn bgPrimary text-nowrap">+ Agregar Producto</button>
                    </div>
                </div>
            )}

            <Scroll>
                <table className={`${styles.table} table table-hover mt-3`}>
                    <thead className='table-light text-nowrap'>
                        <tr>
                            <th>Folio</th>
                            <th>Nombre</th>
                            <th>Precio Lista</th>
                            <th>Ensamble</th>
                            <th>Stock</th>
                            <th>Cantidad</th>
                            <th colSpan={3}>Descuento</th>
                            <th>Observaciones</th>
                            <th>Importe (iva)</th>
                            <th>
                                <div>
                                    Acciones
                                    {discounts.length > 0 && (
                                        <button
                                            onClick={setShow}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="iconTable text-warning">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </th>
                        </tr>
                    </thead>

                    <tbody className='text-nowrap'>
                        {action?.Products?.map(item => (
                            <tr key={item.Folio}>
                                <td>{item.Folio}</td>
                                <td>{item.Name}</td>
                                <td>
                                    <input 
                                        type="number" 
                                        name="PricePerUnit" 
                                        id="pricePerUnit" 
                                        value={item.PricePerUnit} 
                                        className={`${styles.input_table}`}
                                        onChange={e => handleChange(e, item.Folio, item.AssemblyGroup)}
                                    />
                                </td>
                                <td>{item.AssemblyGroup !== 0 ? item.AssemblyGroup : 'N/A'}</td>
                                <td>{item.Stock}</td>
                                <td>
                                    <input 
                                        type="number" 
                                        name="Quantity" 
                                        id="quantity" 
                                        value={item.Quantity} 
                                        className={`${styles.input_table}`}
                                        onChange={e => handleChange(e, item.Folio, item.AssemblyGroup)}
                                    />
                                </td>
                                <td>{((+item.Discount)).toFixed(2)}%</td>
                                <td>
                                    <div className='d-flex gap-1 align-items-center'>
                                        <select 
                                            className={`${styles.input_table}`}
                                            name="Discounts" 
                                            id="discounts"
                                            value={discount}
                                            onChange={e => setDiscount(+e.target.value)}
                                        >
                                            <option value="0">0</option>
                                            {discountsAvaible.map(discount => (
                                                <option key={discount.value} value={discount.value}>{discount.value}</option>
                                            ))}
                                        </select>

                                        <div>
                                            <button
                                                disabled={discount === 0}
                                                className={styles.btn_add}
                                                onClick={() => handleAddDiscount(item.Folio, item.AssemblyGroup)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="iconTable text-white">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                </svg>
                                            </button>
                                        </div>

                                    </div>
                                </td>
                                <td>
                                    <div className='d-flex gap-1'>
                                        {item.Discounts.map(discount => (
                                            <button 
                                                className='p-0 text-success'
                                                onClick={() => handleRemoveDiscount(item.Folio, item.AssemblyGroup, discount.id)}
                                            >
                                                {discount.Discount}%
                                            </button>
                                        ))}
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <textarea 
                                            value={item.Observations} 
                                            name="Observations" 
                                            id="observatios"
                                            className={`${styles.textarea_table}`}
                                            rows={1}
                                            onChange={e => handleChange(e, item.Folio, item.AssemblyGroup)}
                                        ></textarea>
                                    </div>
                                </td>
                                <td>{formatearDinero(+getTotalsDiscount(+item.PricePerUnit, (1 - +item.Discount / 100), +item.Quantity, 16).subtotal)}</td>
                                <td>
                                    <div className="d-flex justify-content-between">
                                        <button 
                                            onClick={() => {
                                                setDeleteProductId(item.Folio)
                                                setDeleteProductGroup(item.AssemblyGroup)
                                                showDeletePop(true)
                                            }}
                                            className="text-danger p-0 w-100 text-center"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="iconTable">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>

                                        {/* {item.Discounts?.length > 0 && (
                                            <>
                                                <select name="Discount" onChange={e => handleChangeDiscounts(+e.target.value)} id="discount" className="form-select form-select-sm">
                                                    <option value="0">0%</option>
                                                    {discounts.map(discount => (
                                                        <option value={discount.ID} key={discount.ID}>{discount.PercentageTotal}</option>
                                                    ))}
                                                </select>
                                            </>
                                        )} */}

                                        {item?.Accesories?.length > 0 && (
                                            <button
                                                onClick={() => {
                                                    setProduct(item)
                                                    setShowModal(true)
                                                }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="iconTable text-dark">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}

                        <tr>
                            <td colSpan={11} className='text-end fw-bold'>Subtotal:</td>
                            <td>{formatearDinero(+subtotal)}</td>
                        </tr>
                        <tr>
                            <td colSpan={11} className='text-end fw-bold'>IVA:</td>
                            <td>{formatearDinero(+iva)}</td>
                        </tr>
                        <tr>
                            <td colSpan={11} className='text-end fw-bold'>Importe total:</td>
                            <td>{formatearDinero(+total)}</td>
                        </tr>
                    </tbody>
                </table>
            </Scroll>

            <AdminModal
                show={showModal}
                onHide={() => {
                    setShowModal(false)
                    setProduct({})
                }} 
                header={'Ensamblajes'}
            >
                <form
                    onSubmit={e => {
                        e.preventDefault()
                        handleAddProductList(accesoryId, product.Folio, product.AssemblyGroup)
                        setProduct({})
                        setShowModal(false)
                    }}
                >
                    <h3>Seleccione el accesorio</h3>
                    <select 
                        className='form-select' 
                        name="accesory" 
                        id="accesory"
                        onChange={e => setAccessoryId(e.target.value)}
                    >
                        <option value="0">Seleccione un accesorio</option>
                        {product?.Accesories?.map(accesory => (
                            <option value={accesory.AccessoryFolio} key={accesory.AccessoryFolio}>{accesory.Name}</option>
                        ))}
                    </select>

                    <button className='mt-2 btn btn-primary'>Crear Ensamble</button>
                </form>
            </AdminModal>
        </>
    )
}

export default ProductTableView