import axios from 'axios'
import React, { useState } from 'react'
import BackButton from '../components/BackButton'
import { toast } from 'react-toastify'

const CrudTypePage = () => {
    const [type, setType] = useState({
        ID: 0, 
        Name: '', 
        Description: ''
    })

    const handleChange = (e) => {
        setType({
            ...type, 
            [e.target.name] : e.target.value
        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
  
        const config = {
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/types`, { type }, config);
            toast.success(data.msg)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='my-4'>
            <BackButton />

            <h1>Crear Tipo</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name" className='form-label'>Nombre</label>
                    <input value={type.Name} type="text" name="Name" id="name" className='form-control' placeholder='Nombre' onChange={handleChange} />
                </div>

                <input type="submit" value="Guardar tipo" className='btn btn-primary mt-2' />
            </form>
        </div>
    )
}

export default CrudTypePage