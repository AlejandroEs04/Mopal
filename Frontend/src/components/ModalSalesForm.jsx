import { useState } from 'react'
import useAdmin from '../hooks/useAdmin'
import SelectOptions from './SelectOptions'
import useApp from '../hooks/useApp'
import Loader from './Loader'
import formatearFecha from '../helpers/formatearFecha'
import formatearDinero from '../helpers/formatearDinero'
import { JsonToExcel } from 'react-json-to-excel'
import generateReport from '../pdf/generateReport'

const ModalSalesForm = () => {
    const [formInformation, setFormInformation] = useState({
        id: null, 
        products: [], 
        fromDate: null, 
        toDate: null, 
        user: null, 
        trader: null
    })
    const [reportInfo, setReportInfo] = useState(null)
    const { customers, users, handleGetReportInformation, loading } = useAdmin()
    const { products } = useApp()

    const handleChangeInfo = (e) => {
        const { value, name } = e.target
        const isArray = ['product'].includes(name)
        const isNumber = ['id', 'user', 'trader'].includes(name)

        if(isArray) {
            const existProduct = formInformation.products.filter(product => product.Folio === value)
            if(existProduct.length === 0) {
                formInformation.products.push(value)
            } 
        } 

        setFormInformation({
            ...formInformation, 
            [name] : isNumber ? +value : value
        })
    }

    const handleDeleteProducts = (id) => {
        setFormInformation({
            ...formInformation, 
            products : formInformation.products.filter(product => product !== id)
        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        const response = await handleGetReportInformation(formInformation, 'sale-report')
        setReportInfo(response)
    }

    const handleGetImport = (price, discount, iva, quantity) => {
        const subtotal = +price * +discount
        const totalWDiscount = subtotal * (+iva) / 100 
        const total = (totalWDiscount * (+discount / 100))
        return total
    }

    const handleReset = () => {
        setFormInformation({
            id: null, 
            products: [], 
            fromDate: null, 
            toDate: null, 
            user: null, 
            trader: null
        })

        setReportInfo(null)
    }

    return !loading ? reportInfo ? (
            <>
                <h2>Reporte de ventas</h2>
                <p>Aqui podras observar el reporte generado y descargar el excel</p>

                <div className='scroll-y-view'>
                    {reportInfo?.sales?.map(sale => (
                        <div className='mb-4 border-bottom border-black'>
                            <table className='table table-sm'>
                                <thead className='table-light'>
                                    <tr>
                                        <th>Folio</th>
                                        <th>Fecha</th>
                                        <th>Importe total</th>
                                        <th>Cliente</th>
                                        <th>Usuario</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td>{sale.Folio}</td>
                                        <td>{formatearFecha(sale.SaleDate)}</td>
                                        <td>{formatearDinero(+sale.Amount)}</td>
                                        <td>{sale.CustomerID}</td>
                                        <td>{sale.UserID}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <p className='mb-1 fw-bold'>Productos</p>
                            <table className='table table-sm'>
                                <thead className='table-light'>
                                    <tr>
                                        <th>Folio</th>
                                        <th>G. Ensamble</th>
                                        <th>Cantidad</th>
                                        <th>Descuento</th>
                                        <th>Precio p/unidad</th>
                                        <th>Importe</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {sale.products.map(product => (
                                        <tr>
                                            <td>{product.ProductFolio}</td>
                                            <td>{product.AssemblyGroup}</td>
                                            <td>{product.Quantity}</td>
                                            <td>{product.Discount}</td>
                                            <td>{formatearDinero(+product.PricePerUnit)}</td>
                                            <td>{formatearDinero(handleGetImport(product.PricePerUnit, product.Discount, 16, product.Quantity))}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>

                <div className='d-flex gap-2 mt-3'>
                    <button
                        className='btn btn-primary'
                        onClick={() => generateReport(reportInfo, 'Reporte de ventas', 'Reportes de las ventas realizadas e informacion relevante')}
                    >Descargar</button>

                    <button
                        className='btn btn-danger'
                        onClick={handleReset}
                    >Reiniciar</button>
                </div>
            </>
        ) : (
            <form
                onSubmit={handleSubmit}
            >
                <div className='mt-2'>
                    <label htmlFor="customer">Cliente</label>
                    <select 
                        name="user" 
                        id="customer" 
                        className='form-select'
                        value={formInformation.user}
                        onChange={handleChangeInfo}
                    >
                        <option value="0">-- Seleccione un cliente --</option>
                        {customers?.map(customer => (
                            <option value={customer.ID}>{customer.BusinessName}</option>
                        ))}
                    </select>
                </div>

                <div className='mt-2'>
                    <label htmlFor="customer">Producto(s)</label>
                    <SelectOptions 
                        items={products}
                        onChange={handleChangeInfo}
                        name='product'
                    />

                    {formInformation.products.length > 0 && (
                        <div>
                            <p className='fw-bold m-0 mt-1'>Productos a buscar:</p>
                            {formInformation.products.map(product => (
                                <div className='bg-gray d-flex justify-content-between align-items-center p-2 rounded my-1'>
                                    <p className='m-0'>{product}</p>
                                    <button
                                        type='button'
                                        className='btn btn-sm btn-danger'
                                        onClick={() => handleDeleteProducts(product)}
                                    >Eliminar</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className='row mt-2'>
                    <div className='col-md-6'>
                        <label htmlFor="fromDate">Desde:</label>
                        <input 
                            type="date" 
                            name="fromDate" 
                            id="fromDate" 
                            className='form-control' 
                            value={formInformation.fromDate}
                            onChange={handleChangeInfo}
                        />
                    </div>
                    <div className='col-md-6'>
                        <label htmlFor="toDate">Hasta:</label>
                        <input 
                            type="date"
                            name="toDate" 
                            id="toDate" 
                            className='form-control' 
                            value={formInformation.toDate}
                            onChange={handleChangeInfo}
                        />
                    </div>
                </div>

                <div className='mt-2'>
                    <label htmlFor="trader">User</label>
                    <select 
                        name="trader" 
                        id="trader" 
                        className='form-select'
                        value={formInformation.trader}
                        onChange={handleChangeInfo}
                    >
                        <option value="0">-- Seleccione un usuario --</option>
                        {users?.map(user => user.RolID === 3 | user.RolID === 1 && (
                            <option value={user.ID} key={user.ID}>{user.FullName}</option>
                        ))}
                    </select>
                </div>

                <button type='submit' className='btn btn-primary w-100 mt-2'>Obtener reporte</button>
            </form>
        ): <Loader />
}

export default ModalSalesForm