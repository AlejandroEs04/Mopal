import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import * as XLSX from 'xlsx/xlsx.mjs';
import useAdmin from "../hooks/useAdmin";
import { toast } from "react-toastify";

const ExcelProductsCrud = () => {
    const [file, setFile] = useState(null);
    const [productsArray, setProductsArray] = useState([]);

    const navigate = useNavigate();

    const handleAddProducts = async() => {
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, {
                products : productsArray
            }, config)
            toast.success(data.msg)
        } catch (error) {
            toast.error(error.response.data.msg)
        }
    }

    const excelToJson = async() => {
        const reader = new FileReader()

        reader.onload = e => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

            const jData = [];

            for(let i=0; i<sheetData.length; i++) {
                const dato = sheetData[i];
                jData.push({
                    ...dato
                })
            }

            setProductsArray(jData)
        }

        reader.readAsArrayBuffer(file);
    }

    const handleGetProducts = (e) => {
        e.preventDefault()

        if(file) {
            excelToJson();
        } else {
            toast.error('No se ha seleccionado ningun archivo')
        }
    }

    const handleRestartInfo = () => {
        setFile(null)
        setProductsArray([])
    }   

    return (
        <>
            <button onClick={() => navigate(-1)} className="backBtn mt-3 p-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>

                <p>Back</p>
            </button>

            <h1 className='mt-2'>Subir Excel</h1>

            <form 
                className='mt-3'
                onSubmit={handleGetProducts}
            >
                <div className="d-flex align-items-end gap-3">
                    <div className="w-100">
                        <label htmlFor="excelFile" className='form-label'>Subir Archivo</label>
                        <input 
                            type="file" 
                            name="excelFile" 
                            id="excelFile" 
                            className='form-control'
                            onChange={e => setFile(e.target.files[0])}
                            accept='.xlsx, .xls'
                        />
                    </div>

                    <div>
                        <input type="submit" value="Obtener Productos" className='btn btn-dark mt-3' />
                    </div>
                </div>
            </form>

            {productsArray.length > 0 && (
                <>
                    <div className="d-flex justify-content-between align-items-end mb-3 mt-4">
                        <h2 className="m-0 fw-light">Informacion del excel</h2>

                        <div className="d-flex gap-2">
                            <button 
                                className="btn btn-danger btn-sm"
                                onClick={() => handleRestartInfo()}
                            >Reiniciar</button>

                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleAddProducts()}
                            >
                                Guardar Productos
                            </button>
                        </div>
                    </div>
                    
                    <table className="table table-hover">
                        <thead className="table-light">
                            <tr>
                                <th>Folio</th>
                                <th>Nombre</th>
                                <th>Descripcion</th>
                                <th className="text-nowrap">Precio Lista</th>
                                <th>Tipo</th>
                                <th>Clasificacion</th>
                                <th>Stock Disponible</th>
                            </tr>
                        </thead>

                        <tbody>
                            {productsArray.map(product => (
                                <tr key={product.Folio}>
                                    <td>{product.Folio}</td>
                                    <td>{product.Name}</td>
                                    <td>{product.Description}</td>
                                    <td>{product.ListPrice}</td>
                                    <td>{product.TypeID}</td>
                                    <td>{product.ClassificationID}</td>
                                    <td>{product.StockAvaible}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </>
    )
}

export default ExcelProductsCrud