import axios from 'axios'
import React, { useState } from 'react'
import useAdmin from '../hooks/useAdmin'
import { actionDictionary } from '../locales/observation'
import { typeDictionary } from '../locales/observation'
import { toast } from 'react-toastify'
import Spinner from './Spinner'

const observationInitialValues = {
    id: 0,
    description: '', 
    action: '', 
    type: ''
}

export default function ObservationForm() {
    const [observation, setObservation] = useState(observationInitialValues)

    const { observations, loading, setLoading } = useAdmin();

    const handleChange = (e) => {
        const { value, name } = e.target

        setObservation({
            ...observation, 
            [name] : value
        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault()

        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        setLoading(true)

        try {
            let response

            if(observation.id) {
                response = await axios.put(`${import.meta.env.VITE_API_URL}/api/observations`, observation, config);
            } else {
                response = await axios.post(`${import.meta.env.VITE_API_URL}/api/observations`, observation, config);
            }

            setObservation(observationInitialValues)
            toast.success(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteObservation = async(id) => {
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        setLoading(true)

        try {
            const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}/api/observations/${id}`, config);
            toast.success(data)
            setObservation(observationInitialValues)
        } catch (error) {
            toast.error(error.response.data.msg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <h4 className='fw-normal fs-5 text-start'>Observaciones</h4>

            <form onSubmit={handleSubmit} className='text-start'>
                <div className='d-flex flex-column'>
                    <label htmlFor="description" className='fw-bold'>Descripción</label>
                    <textarea 
                        value={observation.description} 
                        onChange={handleChange} 
                        rows={3} 
                        className='form-control' 
                        name="description" 
                        id="description" 
                        placeholder='Descripción de la observación'
                    ></textarea>
                </div>

                <div className='d-flex flex-column mt-2'>
                    <label htmlFor="action" className='fw-bold'>Acción</label>
                    <select 
                        name="action" 
                        id="action" 
                        className='form-select text-capitalize'
                        value={observation.action}
                        onChange={handleChange}
                    >
                        {Object.entries(actionDictionary).map(([key, value]) => (
                            <option key={key} value={key}>{value}</option>
                        ))}
                    </select>
                </div>
                
                <div className='d-flex flex-column mt-2'>
                    <label htmlFor="type" className='fw-bold'>Tipo</label>
                    <select 
                        name="type" 
                        id="type" 
                        className='form-select text-capitalize'
                        value={observation.type}
                        onChange={handleChange}
                    >
                        {Object.entries(typeDictionary).map(([key, value]) => (
                            <option key={key} value={key}>{value}</option>
                        ))}
                    </select>
                </div>

                {loading ? <Spinner /> : (
                    <>
                        <input type="submit" value={`${observation.id ? 'Actualizar' : 'Guardar'} observación`} className='btn btn-primary btn-sm w-100 mt-3' />
        
                        {observation.id !== 0 && (
                            <>
                                <button onClick={() => handleDeleteObservation(observation.id)} className='btn btn-danger btn-sm w-100 mt-1' type='button'>Eliminar</button>
                                <button onClick={() => setObservation(observationInitialValues)} className='btn btn-dark btn-sm w-100 mt-1' type='button'>Cancelar</button>
                            </>
                        )}
                    </>
                )}
                
            </form>
            
            <div className='mt-3 text-start'>
                <table className='table table-hover table-sm'>
                    <thead className='table-secondary'>
                        <tr>
                            <th>Texto</th>
                            <th>Acción</th>
                            <th>Tipo</th>
                        </tr>
                    </thead>

                    <tbody>
                        {observations?.map(observation => (
                            <tr key={observation.id} onDoubleClick={() => setObservation(observation)}>
                                <td className='text-capitalize'>{observation.description}</td>
                                <td className='text-capitalize'>{actionDictionary[observation.action]}</td>
                                <td className='text-capitalize'>{typeDictionary[observation.type]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}
