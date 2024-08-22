import { useParams, Link } from "react-router-dom"
import useAdmin from "../hooks/useAdmin";
import { useEffect, useMemo, useState } from "react";
import formatearDinero from "../helpers/formatearDinero";
import Spinner from "../components/Spinner";
import formatearFecha from "../helpers/formatearFecha";
import generatePurchasePdf from "../pdf/generatePurchasePdf";
import Scroll from "../components/Scroll";
import findLastID from "../helpers/findLastID ";
import findNextID from "../helpers/findNextID";

const InfoPurchasePage = () => {
    const [purchase, setPurchase] = useState({});

    const { id } = useParams();
    const { purchases, handleChangeStatus, alerta, loading } = useAdmin();

    const handleGetPurchase = () => {
        const purchaseNew = purchases?.filter(purchase => +purchase?.Folio === +id)
        setPurchase(purchaseNew[0]);
    }
   
    const handleGetImporte = (price, quantity, discount) => {
        const importe = (price * quantity) - ((discount / 100) * (price * quantity))
        return importe.toFixed(2)
    }

    const handleNextQuotation = () => {
        if(purchases.length > 0) {
            return findNextID(purchases, id)
        }
    }
    
    const handleLastQuotation = () => {
        if(purchases.length > 0) {
            return findLastID(purchases, id)
        }
    }

    const subtotal = useMemo(() => purchase?.Products?.reduce((total, product) => total + (+handleGetImporte(product.PricePerUnit, product.Quantity, product.Discount)), 0), [purchase])
    const iva = useMemo(() => purchase?.Products?.reduce((total, product) => total + (+handleGetImporte(product.PricePerUnit, product.Quantity, product.Discount) * .16), 0), [purchase])
    const total = useMemo(() => subtotal + iva, [purchase])

    useEffect(() => {
        handleGetPurchase();
    }, [purchases, id])

    return (
        <div className="container my-4">
            <div className="d-flex justify-content-between mb-4">
                <Link to={'/admin/purchase'} className="backBtn text-decoration-none text-black">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>

                    <p>Back</p>
                </Link>

                <div className="d-flex gap-3">
                    <Link to={`/info/purchases/${handleLastQuotation()}`} className="backBtn text-decoration-none text-dark">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                        <p>Anterior</p>
                    </Link>

                    <Link to={`/info/purchases/${handleNextQuotation()}`} className="backBtn text-decoration-none text-dark">
                        <p>Siguiente</p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </Link>
                </div>
            </div>

            <div className="d-flex flex-column flex-lg-row justify-content-start justify-content-lg-between align-items-lg-center mb-2">
                <h1>Informacion de la compra</h1>
                <div className="d-flex gap-2">
                    <button 
                        className="btn btn-dark"
                        type="button"
                        onClick={() => generatePurchasePdf(purchase, subtotal, iva, total, true)}
                    >
                        Descargar PDF
                    </button>

                    {purchase?.StatusID < 2 && (
                        <button
                            className={`
                                btn
                                btn-success fw-bold
                            `}
                            disabled={+purchase?.StatusID === 2}
                            onClick={() => handleChangeStatus('purchases', purchase?.Folio, (purchase?.StatusID + 1))}
                        >
                            Recibida
                        </button>
                    )}
                </div>
            </div>

            {alerta && (
                <p className={`alert ${alerta.error ? 'alert-danger' : 'alert-success'}`}>{alerta.msg}</p>
            )}

            {loading ? (
                <Spinner />
            ) : (
                <div>
                    <p className="mb-1 fw-bold">Folio: <span className="fw-normal">{purchase?.Folio}</span></p>
                    <p className="mb-1 fw-bold">Fecha de la venta: <span className="fw-normal">{formatearFecha(purchase?.PurchaseDate)}</span></p>
                    <p className="mb-1 fw-bold">
                        Estado: <span className={`${+purchase?.StatusID === 1 && 'text-danger'} ${+purchase?.StatusID === 2 && 'text-success'} fw-normal`}>{purchase?.Status}</span>
                    </p>
                    <p className="mb-1 fw-bold">Observaciones: <span className="fw-normal">{purchase?.Observation}</span></p>

                    <h4 className="mt-4">Informacion del proveedor</h4>
                    <p className="mb-1 fw-bold">Direccion de entrega: <span className="fw-normal">{purchase?.Address}</span></p>
                    <p className="mb-1 fw-bold">Razon social: <span className="fw-normal">{purchase?.BusinessName}</span></p>
                    <p className="mb-1 fw-bold">RFC: <span className="fw-normal">{purchase?.RFC}</span></p>
                    <p className="mb-1 fw-bold">Correo: <span className="fw-normal">{purchase?.Email}</span></p>

                    {purchase?.SupplierUserID && (
                        <>
                            <h4 className="mt-3">Información del usuario</h4>
                            <p className="mb-1 fw-bold">ID del usuario: <span className="fw-normal">{purchase?.SupplierUserID}</span></p>
                            <p className="mb-1 fw-bold">Nombre del usuario: <span className="fw-normal">{purchase?.SupplierUserName}</span></p>
                            <p className="mb-1 fw-bold">Email del usuario: <span className="fw-normal">{purchase?.SupplierUserEmail}</span></p>
                            <p className="mb-1 fw-bold">Dirección del usuario: <span className="fw-normal">{purchase?.SupplierUserAddress}</span></p>
                        </>
                    )}


                    <h4 className="mt-4">Informacion de los productos</h4>
                    <Scroll>
                        <table className="table table-hover">
                            <thead className="table-secondary">
                                <tr>
                                    <th>Folio</th>
                                    <th>Precio</th>
                                    <th colSpan={2}>Descuento</th>
                                    <th>Grupo</th>
                                    <th>Cantidad</th>
                                    <th>Observaciones</th>
                                    <th>Importe</th>
                                    <th className="text-nowrap">Total (IVA %)</th>
                                </tr>
                            </thead>

                        <tbody>
                            {purchase?.Products?.map(product => (
                                <tr key={product.Folio}>
                                    <td>{product.Folio}</td>
                                    <td>{formatearDinero(+product.PricePerUnit)}</td>
                                    <td>{`${product.Discount}%`}</td>
                                    <td>
                                        <div className="d-flex">
                                            {product?.Discounts?.map(discount => (
                                                <p className="m-0">{`+${(+discount?.Discount).toFixed(0)}`}</p>
                                            ))}
                                        </div>
                                    </td>
                                    <td>{product.AssemblyGroup === 0 ? 'N/A' : product.AssemblyGroup ?? 'N/A'}</td>
                                    <td>{product.Quantity}</td>
                                    <td>{product.Observations ?? 'N/A'}</td>
                                    <td>{formatearDinero(+handleGetImporte(product.PricePerUnit, product.Quantity, product.Discount)) + " " + purchase?.Acronym}</td>
                                    <td>{formatearDinero(+handleGetImporte(product.PricePerUnit, product.Quantity, product.Discount) + (+handleGetImporte(product.ListPrice, product.Quantity, product.Discount) * .16)) + " " + purchase?.Acronym}</td>
                                </tr>
                            ))}

                                <tr>
                                    <td colSpan={7} className="table-active"></td>
                                    <th>Subtotal: </th>
                                    <td>{formatearDinero(subtotal ?? 0)}</td>
                                </tr>
                                <tr>
                                    <td colSpan={7} className="table-active"></td>
                                    <th>IVA: </th>
                                    <td>{formatearDinero(iva ?? 0)}</td>
                                </tr>
                                <tr>
                                    <td colSpan={7} className="table-active"></td>
                                    <th>Importe total: </th>
                                    <td>{formatearDinero(total ?? 0)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </Scroll>
                    <h4 className="mt-4">Informacion del comprador</h4>
                    <p className="mb-1 fw-bold">Usuario responsable: <span className="fw-normal">{purchase?.User}</span></p>
                </div>
            )}
            
        </div>
    )
}

export default InfoPurchasePage