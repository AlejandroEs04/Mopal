import { useState, useEffect, useCallback } from "react"
import axios from "axios";
import useAdmin from "../hooks/useAdmin";
import CloudinaryWidget from "./CloudinaryWidget";
import Select from 'react-select'
import Accordion from 'react-bootstrap/Accordion';

const ProductViewForm = ({productList, handleChangeNoInput}) => {
    const [characteristicItem, setCharacteristicItem] = useState({
        CharacteristicHeader : '', 
        CharacteristicContent : ''
    })
    const [specificationsArray, setSpecificationsArray] = useState([]);
    const [characteristicsArray, setCharacteristicsArray] = useState([])
    const [speInput, setSpeInput] = useState(false)
    const [charInput, setCharInput] = useState(false)
    const [charType, setCharType] = useState(0)
    const [newHeaderImage, setNewHeaderImage] = useState("");
    const [newIconImage, setNewIconImage] = useState("");
    const [cloudinaryHeader, setCloudinaryHeader] = useState(false);

    const { specifications, setAlerta, alerta } = useAdmin();

    // Inicializar select
    const [speSelected, setSpeSelected] = useState(null)
    const [valueSpe, setValueSpe] = useState('')

    const speOptions = specifications?.map(specification => {
        const speNew = {
            value : specification.ID, 
            label : specification.Name
        }

        return speNew
    })

    const handleSelectSpe = (selected) => {
        setSpeSelected(selected)
    }

    // Array add element
    const handleAddSpeArray = () => {
        const existSpecification = productList?.specifications?.filter(specification => specification.SpecificationID === speSelected.value)

        if(!existSpecification.length) {
            setSpecificationsArray([
                ...specificationsArray,
                {
                    SpecificationID : speSelected.value, 
                    SpecificationName : speSelected.label, 
                    ProductListID :  productList?.ID,
                    Value : valueSpe.trim()
                }
            ])
        } else {
            setAlerta({
                error: true, 
                msg: "La especificación ya existe"
            })
        }

        setSpeSelected(null)
        setValueSpe('')
        setSpeInput(false)
    }

    const checkArray = useCallback(() => {
        return specificationsArray.length === 0 &&
            productList?.ImageHeaderURL === "" &&
            productList?.ImageIconURL === ""
    }, [specificationsArray, newHeaderImage, newIconImage])

    useEffect(() => {
        checkArray()
    }, [specificationsArray, newHeaderImage, newIconImage])

    useEffect(() => {
        if(newHeaderImage !== "")
            setImageHeaderURL(newHeaderImage);
    }, [newHeaderImage])

    useEffect(() => {
        if(newIconImage !== "")
            setImageIconURL(newIconImage);
    }, [newIconImage])

    const handleSaveProductInfo = async() => {
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/productsList/info`, {
                specifications : specificationsArray,
                imageHeaderURL : productList.ImageHeaderURL, 
                imageIconURL : productList.ImageIconURL,
                id : productList.ID
            }, config)

            setAlerta({
                error: false, 
                msg: data.msg
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handleChangeCharactaeristicItem = (e) => {
        setCharacteristicItem({
            ...characteristicItem, 
            [e.target.name] : e.target.value
        })
    }

    const handleAddCharacteristicArray = () => {
        setCharacteristicsArray([
            ...characteristicsArray, 
            characteristicItem
        ])

        setCharacteristicItem({
            CharacteristicHeader : '', 
            CharacteristicContent : ''
        })
    }

    return (
        <div className='container border my-4 py-2'>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="fw-medium fs-6 m-0">Informacion de la pagina</h2>
                <button 
                    onClick={() => handleSaveProductInfo()} 
                    type="button"
                    className="btn btn-sm btn-success"
                    disabled={checkArray()}
                >Guardar Cambios</button>
            </div>

            <div>
                <div className="row mt-2">

                    {productList?.ImageHeaderURL ? (
                        <div className="col-9">
                            <h3 className="mb-0 fw-bold fs-6">Imagen de fondo del producto</h3>
                            <div className="containerCompleteImageBackgound mt-2 rounded" 
                                style={{
                                    backgroundImage: `url('${productList?.ImageHeaderURL}')`
                                }}
                            >
                                <p>{productList?.Name}</p>
                            </div>

                            {cloudinaryHeader ? (
                                <CloudinaryWidget 
                                    text="Cambiar Imagen"
                                    setImagenUrl={handleChangeNoInput}
                                    elementHandleChange="ImageHeaderURL"
                                />
                            ) : (
                                <button onClick={() => setCloudinaryHeader(!cloudinaryHeader)} className="btn btn-sm my-2 bgPrimary">Cambiar Imagen de fondo</button>
                            )}
                            
                        </div>
                    ) : (
                        <>
                            <div className="col-12"> 
                                <h3 className="mb-0 fw-bold fs-6">Seleccione imagen de fondo</h3>
                                <CloudinaryWidget 
                                    completeBtn
                                    text="Seleccione una imagen de fondo"
                                    setImagenUrl={handleChangeNoInput}
                                    elementHandleChange="ImageHeaderURL"
                                />
                            </div>
                        </>
                    )}

                    {productList?.ImageHeaderURL && (
                        <div className="col-3">
                            {productList?.ImageIconURL ? (
                                <>
                                    <h3 className="mb-0 fw-bold fs-6">Icono del producto</h3>
                                    <img src={productList?.ImageIconURL} alt="" />
                                </>
                            ) : (
                                <>
                                    <h3 className="mb-0 fw-bold fs-6">Seleccione el icono</h3>
                                    <CloudinaryWidget 
                                        completeBtn
                                        text="Seleccione el icono del producto"
                                        setImagenUrl={handleChangeNoInput}
                                        elementHandleChange="ImageIconURL"
                                    />
                                </>
                            )}
                        </div>
                    )}

                </div>

                <p className="text textPrimary fw-medium">{productList?.Name}</p>

                

                <p className="my-1">Especificaciones</p>
                <button className="btn btn-sm btn-success" type="button" onClick={() => setSpeInput(true)}>+ Agregar especificación</button>

                {speInput && (
                    <>
                        <div className="mt-1">
                            <label>Especificación</label>
                            <Select 
                                options={speOptions}
                                onChange={handleSelectSpe}
                                className="w-100"
                                value={speSelected}
                            />
                        </div>

                        {speSelected && (
                            <>
                                <div className="mt-1">
                                    <label>Valor</label>
                                    <input type="text" value={valueSpe} onChange={e => setValueSpe(e.target.value)} className="form-control" placeholder="Valor de la especificacion" />
                                </div>

                                <button 
                                    className={`btn ${valueSpe === '' ? 'bgIsInvalid' : 'bgPrimary'} btn-sm mt-2`}
                                    onClick={() => handleAddSpeArray()}
                                    disabled={valueSpe === ''}
                                    type="button"
                                >Agregar especificación</button>
                            </>
                        )}
                    </>
                                    
                )}
                                
                {specificationsArray?.map(specification => (
                    <div className="mt-3" key={specification.SpecificationID + '' + specification.ProductListID + '' + specification.Value}>
                        <label>{specification.SpecificationName}</label>
                        <input type="text" value={specification.Value} disabled className="form-control form-control-sm" />
                    </div>            
                ))}

                {productList?.specifications?.map(specification => (
                    <div className="mt-3" key={specification.SpecificationID + '' + specification.ProductListID + '' + specification.Value}>
                        <label>{specification.Specification}</label>
                        <input type="text" value={specification.Value} disabled className="form-control form-control-sm" />
                    </div>
                ))}

                <p className="mb-1 mt-2">Caracteristicas y Beneficios</p>
                <button type="button" onClick={() => setCharInput(!charInput)} className="btn btn-sm btn-success">Agregar Caracteristica</button>

                {charInput && (
                    <div className="mt-3 p-4 border rounded">
                        <label htmlFor="charType">Seleccione un tipo de caracteristica</label>
                        <select value={charType} onChange={e => setCharType(e.target.value)} id="charType" className="form-select">
                            <option value="0">Seleccione un tipo</option>
                            <option value="1">Texto</option>
                            <option value="2">Lista</option>
                            <option value="3">Acordion</option>
                        </select>

                        <div className="mt-4">
                            {charType === "1" && (
                                <>
                                    <label htmlFor="texto">Escriba el texto</label>
                                    <textarea name="" id="texto" className="form-control" rows={5}></textarea>

                                    <button className="btn bgPrimary mt-3">Guardar Caracteristica</button>
                                </>
                            )}

                            {charType === "2" && (
                                <div className="row">
                                    <div className="col-md-6">
                                        <label htmlFor="characteristicHeader">Elija el titulo</label>
                                        <input 
                                            type="text" 
                                            name="CharacteristicHeader" 
                                            id="characteristicHeader" 
                                            className="form-control" 
                                            placeholder="Titulo" 
                                            value={characteristicItem.CharacteristicHeader}
                                            onChange={e => handleChangeCharactaeristicItem(e)}
                                        />
                                        
                                        <label htmlFor="characteristicContent">Elija el contenido</label>
                                        <textarea 
                                            className="form-control"
                                            name="CharacteristicContent" 
                                            id="characteristicContent"
                                            value={characteristicItem.CharacteristicContent}
                                            onChange={e => handleChangeCharactaeristicItem(e)}
                                            rows={5}
                                        ></textarea> 

                                        <button 
                                            type="button"
                                            className="btn btn-primary btn-sm mt-2"
                                            onClick={() => handleAddCharacteristicArray()}
                                        >Agregar Caracteristica</button>
                                    </div>

                                    <div className="col-md-6">
                                        {characteristicsArray.length > 0 ? (
                                            <>
                                                <li>
                                                    {characteristicsArray?.map(characteristic => (
                                                        <ul className="d-flex">
                                                            <p>{characteristic.CharacteristicHeader}: {characteristic.CharacteristicContent}</p>
                                                        </ul>
                                                    ))}
                                                </li>
                                            </>
                                        ) : (
                                            <p>Aun no hay caracteristicas</p>
                                        )}                                
                                    </div>
                                </div>
                            )}

                            {charType === "3" && (
                                <div className="row">
                                    <div className="col-md-6">
                                        <label className="form-label" htmlFor="characteristicHeader">Nombre de la caracteristica</label>
                                        <input 
                                            className="form-control" 
                                            type="text" 
                                            name="CharacteristicHeader" 
                                            id="characteristicHeader" 
                                            placeholder="Nombre de la caracteristica"
                                            value={characteristicItem.CharacteristicHeader}
                                            onChange={e => handleChangeCharactaeristicItem(e)}
                                        />

                                        <label className="form-label" htmlFor="characteristicContent">Valor o descripcion</label>
                                        <textarea 
                                            className="form-control" 
                                            name="CharacteristicContent" 
                                            id="characteristicContent"
                                            value={characteristicItem.CharacteristicContent}
                                            onChange={e => handleChangeCharactaeristicItem(e)}
                                        ></textarea>

                                        <button 
                                            type="button"
                                            className="btn btn-primary btn-sm mt-2"
                                            onClick={() => handleAddCharacteristicArray()}
                                        >Agregar Caracteristica</button>
                                    </div>

                                    <div className="col-md-6">
                                        {characteristicsArray.length > 0 ? (
                                            <>
                                                <Accordion defaultActiveKey={0}>
                                                    {characteristicsArray?.map(characteristic => (
                                                        <Accordion.Item eventKey={characteristic.CharacteristicHeader}>
                                                            <Accordion.Header>{characteristic.CharacteristicHeader}</Accordion.Header>
                                                            <Accordion.Body>
                                                                {characteristic.CharacteristicContent}
                                                            </Accordion.Body>
                                                        </Accordion.Item>
                                                    ))}
                                                </Accordion>
                                            </>
                                        ) : (
                                            <p>Aun no hay caracteristicas</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProductViewForm