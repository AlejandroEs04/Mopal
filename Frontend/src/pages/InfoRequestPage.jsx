import { useParams, useNavigate } from "react-router-dom"
import useAdmin from "../hooks/useAdmin";
import { useEffect, useState } from "react";
import formatearFecha from "../helpers/formatearFecha";

const InfoRequestPage = () => {
    const [requestN, setRequestN] = useState({});

    const { id } = useParams();
    const { request } = useAdmin();

    const navigate = useNavigate();

    const handleGetRequest = () => {
        const requestNew = request?.filter(request => +request?.ID === +id)
        setRequestN(requestNew[0]);
    }

    const subtotal = useMemo(() => sale?.Products?.reduce((total, product) => total + ((product.Quantity * product.ListPrice) * (product.Percentage / 100)), 0), [sale])
    const iva = useMemo(() => sale?.Products?.reduce((total, product) => total + (product.Quantity * ((product.ListPrice * (product.Percentage / 100)) * .16)), 0), [sale])
    const total = useMemo(() => subtotal + iva, [sale])

    useEffect(() => {
        handleGetRequest();
    }, [request])

    console.log(requestN)

    return (
        <div className="container my-4">
            <button onClick={() => navigate(-1)} className="backBtn mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>

                <p>Back</p>
            </button>

            <div className="d-flex justify-content-between align-items-center">
                <h1>Informacion de la venta</h1>
                <div>
                    <button
                        className={`
                            btn
                            ${+requestN?.Status === 2 && 'btn-warning fw-bold'}
                            ${+requestN?.Status === 3 && 'btn-success fw-bold'}
                        `}
                    >
                        {+requestN?.Status === 2 && 'En reparto'}
                        {+requestN?.Status === 3 && 'Entregado'}
                    </button>
                </div>
            </div>
            
            <div>
                <p className="mb-1 fw-bold">Folio: <span className="fw-normal">{requestN?.ID}</span></p>
                <p className="mb-1 fw-bold">Fecha de la venta: <span className="fw-normal">{formatearFecha(requestN?.CreationDate)}</span></p>
                <p className="mb-1 fw-bold">
                    Estado:
                    <span 
                        className={`
                            ${+requestN?.Status === 1 && 'text-danger'} 
                            ${+requestN?.Status === 2 && 'text-danger'} 
                            ${+requestN?.Status === 3 && 'text-warning'} 
                            ${+requestN?.Status === 4 && 'text-success'} 
                            fw-normal
                        `}>
                            {requestN?.Status === 1 && " En espera"}
                            {requestN?.Status === 2 && " Aceptada"}
                            {requestN?.Status === 3 && " En reparto"}
                            {requestN?.Status === 4 && " Entregada"}
                        </span>
                </p>

                <h4 className="mt-4">Informacion del cliente</h4>
                <p className="mb-1 fw-bold">
                    Direccion de entrega: {" "}
                    <span className="fw-normal">
                        {requestN?.CustomerAddress}
                        {requestN?.SupplierAddress}
                    </span>
                </p>

                <p className="mb-1 fw-bold">
                    Razon social: {" "}
                    <span className="fw-normal">
                        {requestN?.CustomerName}
                        {requestN?.SupplierName}
                    </span>
                </p>

                <p className="mb-1 fw-bold">
                    RFC: {" "}
                    <span className="fw-normal">
                        {requestN?.CustomerRFC}
                        {requestN?.SupplierRFC}
                    </span>
                </p>

                <h4 className="mt-4">Informacion del vendedor</h4>
                <p className="mb-1 fw-bold">Usuario responsable: <span className="fw-normal">{requestN?.UserFullName}</span></p>
                <p className="mb-1 fw-bold">Email: <span className="fw-normal">{requestN?.Email}</span></p>
                <p className="mb-1 fw-bold">Numero: <span className="fw-normal">{requestN?.Number}</span></p>
                <p className="mb-1 fw-bold">Dirección: <span className="fw-normal">{requestN?.Address}</span></p>
                <p className="mb-1 fw-bold">Detalles: <span className="fw-normal"></span></p>

                <h4 className="mt-4">Informacion de los productos</h4>
                <table className="table table-hover">
                    <thead className="table-secondary">
                        <tr>
                            <th>Folio</th>
                            <th>Cantidad</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>{requestN?.ProductFolio}</td>
                            <td>{requestN?.Quantity}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default InfoRequestPage