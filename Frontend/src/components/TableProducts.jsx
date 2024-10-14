import { useLocation, Link } from "react-router-dom";
import useAdmin from "../hooks/useAdmin";
import axios from "axios";
import formatearDinero from "../helpers/formatearDinero";
import Scroll from "./Scroll";
import { useMemo } from "react";
import { toast } from "react-toastify";

export const ProductTr = ({ product, setShow, setFolio }) => {
    const { pathname } = useLocation();

    const checkPathname = () => {
        return pathname.includes('purchase') || 
        pathname.includes('sale')
    }

    const handleShow = () => {
        setShow(true)
    };

    const handleActivateProduct = async(actFolio) => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await axios(`${import.meta.env.VITE_API_URL}/api/products/activate/${actFolio}`, config)
            toast.success(data.msg)
            setFolio('')
        } catch (error) {
            console.log(error)
            toast.error('Error al activar el producto')
        }
    }

    const productStock = useMemo(() => +product.StockAvaible + +product.StockOnWay,[product])

    return (
        <tr>
            <td className="text-nowrap">{product?.Folio}</td>
            <td>{product?.Name}</td>
            <td
                className={`
                    ${productStock < (+product.MinStock ) && productStock >= (+product.MinStock * .45) ? 'table-yellow' : 
                        productStock < (+product.MinStock * .45) && productStock > (+product.MinStock * .30) ? 'table-warning' : 
                        productStock <= (+product.MinStock * .30) ? 'table-danger' : 
                        productStock > +product.MinStock && 'table-primary' 
                    }

                `}
            >{product?.StockAvaible}</td>
            <td>{product?.StockOnHand}</td>
            <td>{product?.StockOnWay}</td>
            <td>${formatearDinero(product?.ListPrice)}</td>
            <td>{product?.Type}</td>
            <td>{product?.Classification}</td>
            <td className={`${product?.Active === 1 ? 'text-success' : 'text-danger'}`} >{product?.Active === 1 ? 'Activo' : 'Inactivo'}</td>
            {!checkPathname() && (
                <td className="">
                    <Link to={`/admin/products/form/${product?.Folio}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-100 h-100 iconTable editar">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                    </Link>

                    {product.Active === 1 ? (
                        <button 
                            type='button' 
                            onClick={() => {
                                handleShow()
                                    setFolio(product.Folio)
                                }}
                            >                                            
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-100 h-100 iconTable eliminar">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                        </button>
                    ) : (
                        <button 
                            type='button' 
                            onClick={() => {
                                handleActivateProduct(product?.Folio)
                            }}
                        >                                            
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-100 h-100 iconTable text-success">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                        </button>
                    )}
                </td>
            )}
        </tr>
    )
}

const TableProducts = ({ products, showDeleted, setShow, setFolio }) => {
    const { pathname } = useLocation();

    const checkPathname = () => {
        return pathname.includes('purchase') || 
        pathname.includes('sale')
    }

    return (
        <Scroll>
            {products?.length > 0 ? (
                <table className="table table-hover mt-2">
                    <thead className="table-light">
                        <tr>
                            <th className="text-nowrap">Folio</th>
                            <th className="text-nowrap">Nombre</th>
                            <th className="text-nowrap">Disponible</th>
                            <th className="text-nowrap">No Disponible</th>
                            <th className="text-nowrap">En Camino</th>
                            <th className="text-nowrap">Precio Lista</th>
                            <th className="text-nowrap">Tipo</th>
                            <th className="text-nowrap">Clasificacion</th>
                            <th className="text-nowrap">Activo</th>
                            {!checkPathname() && (
                                <th className="text-nowrap">Acciones</th>
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {products?.map(product => product.Active === 1 && (
                            <ProductTr 
                                product={product}
                                setShow={setShow}
                                setFolio={setFolio}
                                key={product.Folio}
                            />
                        ))}

                        {showDeleted && products.map(product => product.Active === 0 && (
                            <ProductTr 
                                product={product}
                                setShow={setShow}
                                setFolio={setFolio}
                                key={product.Folio}
                            />
                        ))}
                    </tbody>
                </table>
            ) : (
                <div>
                    <h3 className='fw-bold text-center mt-3'>Aun no hay productos dados de alta</h3>
                </div>
            )}
        </Scroll>
    )
}

export default TableProducts