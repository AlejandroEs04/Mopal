import { useParams, Link } from "react-router-dom"
import { useEffect, useState, useMemo } from "react";
import useAdmin from "../hooks/useAdmin";
import formatearDinero from "../helpers/formatearDinero";
import Spinner from "../components/Spinner";
import findLastID from "../helpers/findLastID ";
import findNextID from "../helpers/findNextID";
import generateQuotationPdf from "../pdf/generateQuotationPdf";
import Scroll from "../components/Scroll";
import formatearFechaInput from "../helpers/formatearFechaInput";
import useApp from "../hooks/useApp";
import formatearFecha from "../helpers/formatearFecha";

const InfoSalePage = () => {
    const [sale, setSale] = useState({});
    const [currency, setCurrency] = useState(1)

    const { id } = useParams();
    const { currentCurrency, handleGetCurrency } = useApp()
    const { sales, handleChangeStatus, loading, sendQuotationPdf } = useAdmin();
    
    const handleGetTypes = () => {
        let array = []

        if(+sale?.StatusID === 1) {
            array = sales.filter(sale => sale?.StatusID === 1);
        } else {
            array = sales.filter(sale => sale?.StatusID > 1);
        }
        return array
    }

    const handleNextQuotation = () => {
        if(sales.length > 0) {
            const quotations = handleGetTypes()
            return findNextID(quotations, id)
        }
    }
    
    const handleLastQuotation = () => {
        if(sales.length > 0) {
            const quotations = handleGetTypes()
            return findLastID(quotations, id)
        }
    }
    
    const handleGetSale = () => {
        const saleId = sales?.filter(sale => +sale?.Folio === +id)
        setSale(saleId[0]);
    }
   
    const handleGetImporte = (price, quantity, discount) => {
        const importe = ((price * quantity) - ((discount / 100) * (price * quantity)))
        return importe.toFixed(2) * currency
    }

    const subtotal = useMemo(() => sale?.Products?.reduce((total, product) => total + currency * ((product.Quantity * product.PricePerUnit) - ((product.Discount / 100) * (product.Quantity * product.PricePerUnit))), 0), [sale, currency])
    const iva = useMemo(() => subtotal * .16, [sale, currency])
    const total = useMemo(() => subtotal + iva, [sale, currency])

    useEffect(() => {
        handleGetSale();
    }, [sales, id])

    useEffect(() => {
        const getCurrency = async() => {
            try {
                const currency = await handleGetCurrency(formatearFechaInput(sale?.SaleDate))
                setCurrency(currency?.data?.MXN?.value)
            } catch (error) {
                setCurrency(1)
            }
        }

        if(sale?.Acronym === 'MXN') {
            getCurrency()
        } else {
            setCurrency(1)
        }
    }, [sale, id])

    return (
        <div className="container my-4">
            <div className="d-flex justify-content-between mb-4">
                <Link to={-1} className="backBtn text-decoration-none text-black">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>

                    <p>Back</p>
                </Link>

                <div className="d-flex gap-3">
                    <Link to={`/info/sales/${handleLastQuotation()}`} className="backBtn text-decoration-none text-dark">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                        <p>Anterior</p>
                    </Link>

                    <Link to={`/info/sales/${handleNextQuotation()}`} className="backBtn text-decoration-none text-dark">
                        <p>Siguiente</p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </Link>
                </div>
            </div>

            <div className="d-flex flex-column flex-lg-row justify-content-start justify-content-lg-between align-items-lg-center mb-2">
                <h1>Informacion de la {+sale?.StatusID === 1 ? 'Cotizacion' : 'Venta'}</h1>
                <div className="d-flex gap-2">
                    {(+sale?.StatusID < 4 && sale?.Active === 1) && (
                        <button
                            className={`
                                btn
                                btn-sm
                                ${+sale?.StatusID === 2 && 'btn-warning fw-bold'}
                                ${+sale?.StatusID === 3 && 'btn-success fw-bold'}
                                text-nowrap
                            `}
                            onClick={() => handleChangeStatus('sales', sale?.Folio, (sale?.StatusID + 1))}
                        >
                            {+sale?.StatusID === 2 && 'En reparto'}
                            {+sale?.StatusID === 3 && 'Entregado'}
                        </button>
                    )}

                    {sale?.StatusID === 1 && (
                        <>    
                            <button
                                className="btn btn-dark btn-sm"
                                onClick={() => generateQuotationPdf(sale, subtotal, iva, total, true)}
                            >
                                Descargar PDF
                            </button>
                            <button
                                className="btn btn-success btn-sm"
                                onClick={() => sendQuotationPdf(sale.Folio, sale, subtotal, iva, total)}
                            >
                                Enviar Cotizacion
                            </button>
                        </>
                    )}
                </div>
            </div>

            {loading ? (
                <Spinner />
            ) : (
                <div className="pb-4">
                    <p className="mb-1 fw-bold">Folio: <span className="fw-normal">{sale?.Folio}</span></p>
                    <p className="mb-1 fw-bold">Fecha de la venta: <span className="fw-normal">{formatearFechaInput(sale?.SaleDate)}</span></p>
                    <p className="mb-1 fw-bold">
                        Estado: <span className={`${+sale?.StatusID === 1 && 'text-success'} ${+sale?.StatusID === 2 && 'text-danger'} ${+sale?.StatusID === 3 && 'text-warning'} ${+sale?.StatusID === 4 && 'text-success'} fw-normal`}>{sale?.Status}</span>
                    </p>
                    <p className="mb-1 fw-bold">Activo: <span className={`fw-normal ${sale?.Active === 1 ? 'text-success' : 'text-danger'}`}>{sale?.Active === 1 ? 'Activo' : 'Inactivo'}</span></p>
                    <p className="mb-1 fw-bold">Observaciones: <span className="fw-normal">{sale?.Observation}</span></p>
                    <p className="mb-1 fw-bold">Observaciones (Internas): <span className="fw-normal">{sale?.InternObservation}</span></p>

                    {(sale?.Acronym === 'MXN' && currentCurrency?.meta) && (
                        <p className="fs-7 fw-semibold">Fecha de cambio: {formatearFecha(currentCurrency?.meta?.last_updated_at)}</p>
                    )}

                    <h3 className="mt-4">Informacion del cliente</h3>
                    <p className="mb-1 fw-bold">Direccion de entrega: <span className="fw-normal">{sale?.Address}</span></p>
                    <p className="mb-1 fw-bold">Razon social: <span className="fw-normal">{sale?.BusinessName}</span></p>
                    <p className="mb-1 fw-bold">RFC: <span className="fw-normal">{sale?.RFC}</span></p>

                    {sale?.CustomerUserID && (
                        <>
                            <h4 className="mt-3">Información del usuario</h4>
                            <p className="mb-1 fw-bold">ID del usuario: <span className="fw-normal">{sale?.CustomerUserID}</span></p>
                            <p className="mb-1 fw-bold">Nombre del usuario: <span className="fw-normal">{sale?.CustomerUserName}</span></p>
                            <p className="mb-1 fw-bold">Email del usuario: <span className="fw-normal">{sale?.CustomerUserEmail}</span></p>
                            <p className="mb-1 fw-bold">Dirección del usuario: <span className="fw-normal">{sale?.CustomerUserAddress}</span></p>
                        </>
                    )}

                    {sale?.ContactName?.length > 0 && (
                        <>
                            <h4 className="mt-3">Información del usuario</h4>
                            <p className="mb-1 fw-bold">Nombre de contacto: <span className="fw-normal">{sale?.ContactName}</span></p>
                        </>
                    )}


                    <h3 className="mt-4">Informacion de los productos</h3>
                    <Scroll>
                        <table className="table table-hover">
                            <thead className="table-secondary">
                                <tr>
                                    <th>Folio</th>
                                    <th className="text-nowrap">Grupo E.</th>
                                    <th>Precio</th>
                                    <th colSpan={2}>Desc.</th>
                                    <th>Cant.</th>
                                    <th>Observaciones</th>
                                    <th>Importe</th>
                                    <th className="text-nowrap">Total (IVA %)</th>
                                </tr>
                            </thead>

                            <tbody>
                                {sale?.Products?.map(product => (
                                    <tr key={product.Folio + '-' + product.Assembly}>
                                        <td className="text-nowrap">{product.Folio}</td>
                                        <td>{product.AssemblyGroup === 0 ? 'N/A' : product.AssemblyGroup ?? 'N/A'}</td>
                                        <td>{formatearDinero(+product.PricePerUnit)}</td>
                                        <td>{`${+product.Discount}%`}</td>
                                        <td>{`${product.Discounts.map(discount => `+${(+discount.Discount).toFixed(0)}`)}`}</td>
                                        <td>{product.Quantity}</td>
                                        <td>{product.Observations}</td>
                                        <td className="text-nowrap">{formatearDinero(+handleGetImporte(product.PricePerUnit, product.Quantity, product.Discount)) + " " + sale?.Acronym}</td>
                                        <td className="text-nowrap">{formatearDinero(+handleGetImporte(product.PricePerUnit, product.Quantity, product.Discount) + (+handleGetImporte(product.PricePerUnit, product.Quantity, product.Discount) * .16)) + " " + sale?.Acronym}</td>
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

                    <h3 className="mt-5">Informacion del vendedor</h3>
                    <p className="mb-1 fw-bold">Usuario responsable: <span className="fw-normal">{sale?.User}</span></p>
                </div>
            )}
            
        </div>
    )
}

export default InfoSalePage