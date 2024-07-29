import { useState } from 'react';
import useApp from '../hooks/useApp'
import useAuth from '../hooks/useAuth';
import InventoryContainer from './InventoryContainer'
import Scroll from './Scroll';
import actions from '../data/actions';

const InventoryForm = ({bg = false}) => {
    const [accesoryQuantity, setAccesoryQuantity] = useState(1);
    const [action, setAction] = useState(1);
    const [assemblyCount, setAssemblyCount] = useState(0)
    const [showAccesories, setShowAccesories] = useState(false)
    const [showProductFolio, setShowProductFolio] = useState('')
    const [showProductAssemblyGroup, setShowProductAssemblyGroup] = useState(null)
    const [productsFiltered, setProductsFiltered] = useState([])
    const { alerta, products, setAlerta, setQuantity, handleAddNewRequest, requestProducts, setRequestProducts, setFolio, language } = useApp();
    const { auth } = useAuth();

    const handleAddProduct = (folio, quantity, assembly = '', assemblyGroup = null) => {
        // Copiar arreglo
        let productsArray = requestProducts

        // Obtener el producto
        const product = products.filter(product => product.Folio === folio)[0]

        // Identificar si se crea un grupo
        let AssemblyGroup = assemblyGroup

        if(assembly) {
            if(!assemblyGroup) {
                AssemblyGroup = +assemblyCount + 1

                const productsNew = productsArray.map(product => {
                    if(product.ProductFolio === assembly && !product.AssemblyGroup) {
                        product.AssemblyGroup = AssemblyGroup
                    }
                    return product
                })
                
                setAssemblyCount(AssemblyGroup)

                productsArray = productsNew;
            }
        }

        // Crear producto
        const newProduct = {
            ProductFolio : folio, 
            Name : product.Name, 
            Percentage : 100,
            Quantity : quantity, 
            Stock : product.StockAvaible,
            Accesories : product.accessories, 
            PricePerUnit : product.ListPrice, 
            Assembly : assembly, 
            AssemblyGroup
        }

        const existArray = productsArray.filter(product => product.ProductFolio === folio && product.AssemblyGroup === assemblyGroup)
        
        if(existArray.length === 0) {
            setRequestProducts([
                ...productsArray, 
                newProduct
            ])
        } else {
            const newArray = productsArray.map(product => product.ProductFolio === folio ? newProduct : product)
            setRequestProducts(newArray)
        }

        setFolio('')
        setQuantity(0)
        setProductsFiltered([])
        setShowAccesories(false)
    }

    const handleDeleteProduct = (folio, assemblyGroup) => {
        const productDelete = requestProducts.filter(product => product.ProductFolio === folio && product.AssemblyGroup === assemblyGroup)[0];
        let newArray = []
        
        if(productDelete.Assembly === "" && productDelete.AssemblyGroup) {
            newArray = requestProducts.filter(product => product.AssemblyGroup !== productDelete.AssemblyGroup)
        } else {
            newArray = requestProducts.filter(product => {
                if(product.ProductFolio === folio && product.AssemblyGroup === assemblyGroup) {
                    return false
                } else {
                    return true
                }
            });
        }

        setRequestProducts(newArray);
    }

    const handleClick = () => {
        let actionID = 0

        switch (+action) {
            case 0 : 
                setAlerta({
                    error : true, 
                    msg : "Debe seleccionar una acción"
                })

                setTimeout(() => {
                    setAlerta(null)
                }, 4000)
            break;  

            case 1 :
                actionID = 2
            break;

            case 2 : 
                actionID = 1
            break;
        }

        handleAddNewRequest(auth.ID, requestProducts, actionID)
    }

    return (
        <div className={`${bg && 'bg-white py-4 px-5 rounded shadow'} mt-3`}>
            <InventoryContainer 
                alerta={alerta}
                setAlerta={setAlerta}
                requestProducts={requestProducts}
                setRequestProducts={setRequestProducts}
                handleAddProduct={handleAddProduct}
                productsFiltered={productsFiltered}
                setProductsFiltered={setProductsFiltered}
            />

            <div className='d-flex flex-column flex-lg-row justify-content-between align-lg-items-center pt-2'>
                <h3 className='mt-2'>{language ? 'Product List' : 'Listado de productos'}</h3>
                <div className='d-flex gap-2 align-items-center'>
                    <select
                        value={action}
                        onChange={e => setAction(+e.target.value)}
                        className='form-select'
                    >
                        <option value="0">-- Seleccione una accioón --</option>
                        {actions.map(action => (
                            <option value={action.Id} key={action.Id}>{action.Name}</option>
                        ))}
                    </select>

                    <button
                        className='btn btn-primary'
                        onClick={() => handleClick()}
                        disabled={requestProducts.length === 0}
                    >
                        {language ? 'Send' : 'Enviar'}
                    </button>
                </div>
            </div>

            {requestProducts?.length > 0 ? (
                <Scroll>    
                    <table className='table table-hover mt-2'>
                        <thead className='table-light'>
                            <tr>
                                <th>Folio</th>
                                <th>{language ? 'Name' : 'Nombre'}</th>
                                <th className='text-nowrap'>{language ? 'Quantity' : 'Cantidad'}</th>
                                <th className='text-nowrap'>{language ? 'Stock Avaible' : 'Stock Disponible'}</th>
                                <th className='text-nowrap'>{language ? 'Assambly Group' : 'Grupo Ensamble'}</th>
                                <th>{language ? 'Actions' : 'Acciones'}</th>
                            </tr>
                        </thead>

                        <tbody>
                            {requestProducts?.map(product => (
                                <>
                                    <tr key={product.ProductFolio}>
                                        <td className='text-nowrap'>{product.ProductFolio}</td>
                                        <td className='text-nowrap'>{product.Name}</td>
                                        <td>{product.Quantity}</td>
                                        <td>{product.Stock}</td>
                                        <td>{product.AssemblyGroup}</td>
                                        <td>
                                            <div className='d-flex gap-1'>
                                                <button
                                                    className='btn btn-danger btn-sm'
                                                    onClick={() => handleDeleteProduct(product.ProductFolio, product.AssemblyGroup)}
                                                    >{language ? 'Delete' : 'Eliminar'}</button>

                                                {(product.ProductFolio === showProductFolio && product.AssemblyGroup === showProductAssemblyGroup) ? (
                                                    <button
                                                        onClick={() => {
                                                            setShowAccesories(false)
                                                            setShowProductFolio('')
                                                        }}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="iconTable text-danger">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                ) : product.Accesories.length > 0 && (
                                                    <button
                                                        onClick={() => {
                                                            setShowAccesories(true)
                                                            setShowProductFolio(product.ProductFolio)
                                                            setShowProductAssemblyGroup(product.AssemblyGroup)
                                                        }}
                                                    >   
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="iconTable text-dark">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                        </svg>
                                                    </button>
                                                )}

                                            </div>
                                        </td>
                                    </tr>

                                    {showAccesories && product?.Accesories?.map(accesory => (product.ProductFolio === showProductFolio && product.AssemblyGroup === showProductAssemblyGroup) && (
                                        <tr key={accesory.Folio}>
                                            <td className='fs-6 fw-light'>{accesory.Folio}</td>
                                            <td className='fs-6 fw-light'>{accesory.Name}</td>
                                            <td className='fs-6 fw-light'>
                                                <div>
                                                    <input 
                                                        type="number" 
                                                        placeholder='Numero de piezas' 
                                                        className='form-control form-control-sm w-100'
                                                        value={product.Quantity}
                                                    />
                                                </div>
                                            </td>
                                            <td className={`${accesory.StockAvaible < accesoryQuantity ? 'text-danger' : 'text-dark'} fs-6 fw-light`}>{accesory.StockAvaible}</td>
                                            <td className='fs-6 fw-light'>{product.ProductFolio}</td>
                                            <td colSpan={2} className='fs-6 fw-light'>
                                                <div>
                                                    <button 
                                                        className='btn btn-sm btn-primary w-100'
                                                        onClick={() => handleAddProduct(accesory.Folio, product.Quantity, product.ProductFolio, product.AssemblyGroup)}
                                                    >
                                                        {language ? 'Add' : 'Agregar'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </>
                            ))}
                        </tbody>
                    </table>
                </Scroll>
            ) : (
                <p>No hay productos en la lista</p>
            )}
        </div>
    )
}

export default InventoryForm