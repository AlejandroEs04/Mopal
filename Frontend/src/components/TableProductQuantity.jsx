import React, { useMemo } from 'react'

const TableProductQuantity = ({ text = 'Movimiento de productos', items = [], className = '' }) => {
    const limit = useMemo(() => items.length > 10 ? 5 : items.length / 2, [items])

    return (
        <>
            <h4 className={`${className}`}>{text}</h4>
            <table className='table table-sm table-hover'>
                <thead className='table-light'>
                    <tr>
                        <th>Folio</th>
                        <th>Cantidad</th>
                    </tr>
                </thead>

                <tbody>
                    {items?.slice(0, limit).map(item => (
                        <tr key={item.item_id}>
                            <td>{item.item_id}</td>
                            <td>{item.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

export default TableProductQuantity