import { Link } from "react-router-dom"

const Products = ({product}) => {
    return (
        <div className="col-lg-4 col-sm-6 productTarget">
            <div className={`d-flex justify-content-center align-items-end ${product.ImageIconURL && 'bg-light d-flex align-items-center'} h-100`}>
                {product.ImageIconURL ? (
                    <img src={product?.ImageIconURL} className={`w-100`} alt={`Imagen producto ${product?.Name}`}/>
                ) : (
                    <div>
                        <p className="fw-bold fs-5 text-muted px-4 py-4">No hay imagen disponible por el momento</p>
                    </div>
                )}
            </div>

            <div className="text-center">
                <p className="m-0">{product?.Type}</p>
                <h3 className="fs-4 mb-2">{product?.Name}</h3>
                <Link to={`/productos/${product.Folio}`} className="btnPrimaryBg text-decoration-none" >Saber más</Link>
            </div>
        </div>
    )
  
}

export default Products