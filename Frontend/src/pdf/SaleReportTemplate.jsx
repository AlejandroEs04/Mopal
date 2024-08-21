import formatearFecha from "../helpers/formatearFecha"
import formatearDinero from "../helpers/formatearDinero"

const SaleReportTemplate = ({ reportInfo }) => {
    const handleGetImport = (price, discount, iva, quantity) => {
        const subtotal = +price * +discount
        const totalWDiscount = subtotal * (+iva) / 100 
        const total = (totalWDiscount * (+discount / 100))
        return total
    }

    return (
        <div style={{
            maxWidth: '400px', 
            width: '100%', 
            marginLeft: '20px',
            marginRight: '20px',
            color: 'black',
            backgroundColor: 'white', 
        }}>
            <h2 style={{ fontSize: 15, fontWeight: 'bold' }}>Reporte de ventas</h2>
            <p style={{ fontSize: 10 }}>Aqui podras observar el reporte generado y descargar el excel</p>

            <div style={{ fontSize: 8 }}>
                {reportInfo?.sales?.map(sale => (
                    <div className='mb-2 border-bottom border-black'>
                        <p className='mb-1 fw-bold'>Informacion de la venta</p>
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
                        <table className='table table-sm' style={{  }}>
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
        </div>
    )
}

export default SaleReportTemplate