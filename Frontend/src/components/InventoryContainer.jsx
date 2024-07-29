import { useState } from "react"
import useApp from "../hooks/useApp"
import useAuth from "../hooks/useAuth"
import styles from '../styles/Inventory.module.css'
import Spinner from "./Spinner"
import Scroll from "./Scroll"
import formatearDinero from "../helpers/formatearDinero"

const InventoryContainer = ({ handleAddProduct, productsFiltered, setProductsFiltered }) => {
    const [msg, setMsg] = useState('Favor de seleccionar un producto')
    const [folioBtn, setFolioBtn] = useState('')
    const { products, language, alerta, loading, folio, quantity, handleChangeQuantity, setFolio } = useApp();
    const { auth } = useAuth();

    const handleSetProducto = () => {
        const filtered = products?.filter(product => {
            if(folio !== "") {
                const folioMatch = product.Folio.includes(folio.trim());
                // const folioMatch = product.Folio === folio.trim();
                const isAcive = product.Active === 1;
                return folioMatch && isAcive;
            } else {
                setMsg('Debe elegir algun producto')
            }
        });

        if(filtered.length === 0 && folio !== "") {
            setMsg("El producto no existe o no esta disponible")
        }
        
        setProductsFiltered(filtered)
    }

    return (
        <div className="my-2">
            <h1>{language ? 'Inventory' : 'Inventario'}</h1>
            <p>{language ? 'Search on the input any interest product for your for check your available' : 'Busque en la barra el producto de su interes para comprobar el inventario actual'}</p>

            <div>
                <label htmlFor="search">{language ? 'Enter the product' : 'Ingrese el producto'}</label>
                <div className="d-flex gap-2">
                    <input type="search" id="search" value={folio} onChange={e => setFolio(e.target.value)} className='form-control' placeholder='Ej. 300300-11010169' />
                    <button 
                        onClick={() => handleSetProducto()}
                        className='btn d-flex align-items-center gap-1 btn-secondary'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${styles.svgNavInventory}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                        <p className='m-0'>{language ? 'Search' : 'Buscar'}</p>
                    </button>
                </div>
            </div>

            {alerta && (
                <p className={`alert my-3 ${alerta.error ? 'alert-danger' : 'alert-success'}`}>{language ? alerta.msgEnglish : alerta.msg}</p>
            )}

            {loading ? (
                <Spinner />
            ) : (
                <Scroll>
                    <table className='table mt-3'>
                        <thead className="table-light">
                            <tr>
                                <th>Folio</th>
                                <th className="text-nowrap">{language ? 'Name' : 'Nombre'}</th>
                                <th className="text-nowrap">{language ? 'Stock Avaible' : 'Inventario Actual'}</th>
                                <th className="text-nowrap">{language ? 'Stock on way' : 'Inventario en camino'}</th>
                                <th className="text-nowrap">{language ? 'Required Quantity' : 'Cantidad requerida'}</th>
                                {(auth?.CustomerID) && (
                                    <th className="text-nowrap">{language ? 'Price p/u' : 'Precio p/u'}</th>
                                )}
                                <th>{language ? 'Actions' : 'Acciones'}</th>
                            </tr>
                        </thead>
                                
                        {productsFiltered.length > 0 ? (
                            <>
                                {productsFiltered?.map(product => (
                                    <tbody key={product.Folio}>
                                        <tr>
                                            <td className="text-nowrap">{product.Folio}</td>
                                            <td className="text-nowrap">{product.Name}</td>
                                            <td>{product.StockAvaible}</td>
                                            <td>{product.StockOnWay}</td>
                                            <td>
                                                <input 
                                                    type="number" 
                                                    className='form-control form-control-sm' 
                                                    placeholder={language ? 'Enter a products quantity' : 'Ingrese la cantidad de productos'}
                                                    onChange={e => {
                                                        handleChangeQuantity(e.target.value, product.StockAvaible)
                                                        setFolioBtn(product.Folio)
                                                    }}
                                                />
                                            </td>

                                            {(auth?.CustomerID) && (
                                                <td>
                                                    {formatearDinero(+product.ListPrice)}
                                                </td>
                                            )}

                                            <td>
                                                <div>
                                                    <button
                                                        disabled={quantity <= 0 || product.Folio !== folioBtn}
                                                        onClick={() => handleAddProduct(product.Folio, quantity)}
                                                        className='btn btn-sm btn-success w-100'
                                                    >{language ? 'Add' : 'Agregar'}</button> 
                                                </div>                               
                                            </td>
                                        </tr>
                                    </tbody>
                                ))}
                            </>
                        ) : (
                            <tbody>
                                <tr>
                                    <td colSpan={auth?.CustomerID || auth.ID === undefined ? 7 : 6} className='fw-medium'>{msg}</td>
                                </tr>
                            </tbody>
                        )}                        
                    </table>
                </Scroll>
            )}
        </div>
    )
}

export default InventoryContainer