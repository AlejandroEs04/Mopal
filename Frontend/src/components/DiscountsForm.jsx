import axios from 'axios'
import React, { useEffect, useMemo, useState } from 'react'
import useAdmin from '../hooks/useAdmin'
import { socket } from '../socket'

const initialState = {
    ID: null, 
    Discounts: [], 
    PercentageTotal: 0
}

const DiscountsForm = ({supplier, type}) => {
    const [discount, setDiscount] = useState('')
    const [currentDiscount, setCurrentDiscount] = useState(initialState)

    console.log(supplier)

    const { setAlerta, alerta, setLoading } = useAdmin();

    const handleSetFavorite = async(id) => {
        const discountrUpdating = supplier.Discounts?.filter(discount => discount.ID === +id)[0]

        if(discountrUpdating.Favorite === 0) {
            discountrUpdating.Favorite = 1
        } else {
            discountrUpdating.Favorite = 0
        }

        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/discounts/supplier/${discountrUpdating.ID}`, { discount : discountrUpdating }, config)
            
            setAlerta({
                error: false, 
                msg: data.msg
            })

            setTimeout(() => {
                setAlerta(null)
            }, 3500)
        } catch (error) {
            console.log(error)
        }
    }

    const handleAddDiscount = (e) => {
        e.preventDefault();

        setCurrentDiscount({
            ...currentDiscount, 
            Discounts : [
                ...currentDiscount.Discounts, 
                +discount
            ]
        })

        setDiscount('')
    }

    const token = localStorage.getItem('token');

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    }

    const handleSaveDiscount = async() => {
        let response 

        try {
            if(type === 1) {
                currentDiscount.SupplierID = supplier.ID
                const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/discounts`, currentDiscount, config)
                response = data
            } else if(type === 2) {
                currentDiscount.CustomerID = supplier.ID
                const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/discounts/customer`, currentDiscount, config)
                response = data
            }
            
            setAlerta({
                error: false, 
                msg: response.msg
            })

            setCurrentDiscount(initialState)

            setTimeout(() => {
                setAlerta(null)
            }, 3500)
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteDiscount = async(id) => {
        let response
        setLoading(true)
        try {
            if(type === 1) {
                const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}/api/discounts/supplier/${id}`, config)
                response = data
            } else if(type === 2) {
                const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}/api/discounts/customer/${id}`, config)
                response = data
            }
            
            setAlerta({
                error: false, 
                msg: response.msg
            })

            setTimeout(() => {
                setAlerta(null)
            }, 3500)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useMemo(() => {
        const percentage = currentDiscount.Discounts.reduce((total, discount) => total * (1 - (+discount / 100)), 1)
        setCurrentDiscount({
            ...currentDiscount, 
            PercentageTotal : ((1 - percentage) * 100).toFixed(2)
        })
    }, [currentDiscount.Discounts])

    return (
        <>
            <div className="d-flex gap-2 flex-md-row flex-column justify-content-between mt-4">
                <h2 className="m-0">Descuentos</h2>
            </div>

            <h4 className="fw-light mt-2">Agregar un descuento</h4>

            <div className="row">
                <form className="col-md-6" onSubmit={e => handleAddDiscount(e)}>
                    <div>
                        <label htmlFor="discount" className="form-label mb-1">Descuento</label>
                        <input 
                            type="number" 
                            name="Discount" 
                            id="discount" 
                            onChange={e => setDiscount(e.target.value)} 
                            className="form-control form-control-sm" 
                            placeholder="Porcentaje del descuento (%)" 
                            value={discount}
                        />
                    </div>

                    <div><input type="submit" value="Guardar descuento" className="btn bgPrimary btn-sm mt-2" /></div>
                </form>
                
                <div className="col-md-6">
                    <table className="table table-hover">
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Descuentos</th>
                                <th>Porcentaje final</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>N/A</td>
                                <td>
                                    <div className='d-flex gap-2'>
                                        {currentDiscount.Discounts.map(discount => (
                                            <p className='m-0'>+{discount}</p>
                                        ))}
                                    </div>
                                </td>
                                <td>{currentDiscount.PercentageTotal}%</td>
                                <td><div><button onClick={() => handleSaveDiscount()} className='btn btn-sm bgPrimary'>Guardar</button></div></td>
                            </tr>

                            {supplier?.Discounts?.map(discount => (
                                <tr key={discount.ID}>
                                    <td>{discount?.ID}</td>
                                    <td>
                                        <div className='d-flex gap-2'>
                                            {discount?.Percentages?.map(percentage => (
                                                <p key={(Math.random() * 1000).toFixed(0)} className='m-0'>+{(+percentage?.Percentage).toFixed(0)}</p>
                                            ))}
                                        </div>
                                    </td>
                                    <td>{discount?.PercentageTotal}%</td>
                                    <td>
                                        <div className='d-flex justify-content-start align-items-center gap-1'>
                                            <button 
                                                type='button'
                                                onClick={() => handleDeleteDiscount(discount.ID)}
                                                className='btn btn-sm btn-danger'
                                            >
                                                Eliminar
                                            </button>

                                            <button
                                                type='button'
                                                onClick={() => handleSetFavorite(discount.ID)}
                                            >
                                                {discount.Favorite ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 iconTable text-warning">
                                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.1} stroke="currentColor" className="iconTable">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default DiscountsForm