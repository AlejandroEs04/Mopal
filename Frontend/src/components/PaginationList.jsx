import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from 'react-bootstrap/Pagination'
import TableSales from './TableSales';
import TablePurchases from './TablePurchases';
import TableRequest from './TableRequest';
import formatearDinero from '../helpers/formatearDinero';

const PaginationList = ({ items, limit = 10, type, actionStorage = true }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    let itemsPagination = []
    let limitArray = items.length / limit
    for(let i = 0; i<limitArray;i++) {
        itemsPagination.push(
            <Pagination.Item key={i} onClick={() => setCurrentPage(i + 1)} active={i === currentPage - 1}>
                {i+1}
            </Pagination.Item>
        )
    }

    const thereProducts = useMemo(() => {
        const filteredItems = items.filter(item => item?.ProductsFiltered?.length > 0)
        return filteredItems
    }, [items])

    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;

    useEffect(() => {
        setCurrentPage(1)
    }, [items])

    return (
        <div>
            {type === 1 && (
                <TableSales 
                    sales={items}
                    startIndex={startIndex}
                    endIndex={endIndex}
                    actionStorage={actionStorage}
                />
            )}
            
            {type === 2 && (
                <TablePurchases 
                    purchase={items}
                    startIndex={startIndex}
                    endIndex={endIndex}
                    actionStorage={actionStorage}
                />
            )}
            
            {type === 3 && (
                <TableRequest 
                    items={items}
                    startIndex={startIndex}
                    endIndex={endIndex}
                    actionStorage
                />
            )}

            {items.length > limit && (
                <div className='d-flex justify-content-center pt-2'>
                    <Pagination size="sm">{itemsPagination}</Pagination>
                </div>
            )}

            {thereProducts.length > 0 && !actionStorage && (
                <>
                    <h3 className='mt-3'>Productos Filtrados</h3>
                    <p>Productos filtrados de los movimientos actuales</p>
                    <table className='table'>
                        <thead className='table-light'>
                            <tr>
                                <th>Folio</th>
                                <th>Cantidad</th>
                                <th>Descuento</th>
                                <th>Precio p/u </th>
                                <th>Importe</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => item?.ProductsFiltered?.length > 0 && (
                                <>
                                    <tr className='fw-semibold' onDoubleClick={() => navigate(`info/${item.Folio}`)}>
                                        <td>{item.Folio}</td>
                                        <td colSpan={2}>{item.BusinessName}</td>
                                        <td>{item.User}</td>
                                        <td>{item.Status}</td>
                                    </tr>

                                    {item?.ProductsFiltered?.map(product => (
                                        <tr>
                                            <td>{product.Folio}</td>
                                            <td>{product.Quantity}</td>
                                            <td>{product.Discount}%</td>
                                            <td>{formatearDinero(+product.PricePerUnit)}</td>
                                            <td>{formatearDinero((+product.PricePerUnit * +product.Quantity) - (+product.PricePerUnit * +product.Quantity * (+product.Discount / 100)))}</td>
                                        </tr>
                                    ))}
                                </>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

        </div>
    )
}

export default PaginationList