import { useEffect, useState } from "react";
import styles from '../styles/Producto.module.css'
import Products from "../components/Products";
import useApp from "../hooks/useApp";

const ProductsPage = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [typeFilter, setTypeFilter] = useState(0);
  const [classificationFilter, setClassificationFilter] = useState(0);
  const { classifications, types, products } = useApp();

  const handleDeleteFilters = () => {
    setTypeFilter(0)
    setClassificationFilter(0)
  }

  useEffect(() => {
    setFilteredProducts(products)
  }, [products])

  useEffect(() => {
    let newProducts = products

    if(+typeFilter !== 0) {
      newProducts = newProducts.filter(product => product.TypeID === +typeFilter);
    }

    if(+classificationFilter !== 0) {
      newProducts = newProducts.filter(product => product.ClassificationID === +classificationFilter);
    }

    setFilteredProducts(newProducts)
  }, [typeFilter, classificationFilter])

  return (
    <div className='container my-5'>
      <h1>Nuestros Productos</h1>
      <div className="row">
        <div className={`${styles.filtrosContainer} col-lg-3 mb-4`}>
          <div className={`${styles.filtrosContainerHeader}`}>
            <p className="m-0">Filtros</p>
            <button onClick={() => handleDeleteFilters()} className="text-danger fw-bold">Borrar todo</button>
          </div>
          
          <div>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="form-select form-select-sm mt-2">
              <option value="0">Seleccione un tipo</option>
              {classifications?.map(classification => (
                <option key={classification.ID} value={classification.ID}>{classification.Name}</option>
              ))}
            </select>
          </div>
          <div>
            <select value={classificationFilter} onChange={e => setClassificationFilter(e.target.value)} className="form-select form-select-sm mt-2">
              <option value="0">Seleccione un modelo</option>
              {types?.map(type => (
                <option key={type.ID} value={type.ID}>{type.Name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="col-lg-9">
          <div className="row g-4">
            {filteredProducts?.map(product => (
              <Products
                key={product.Folio}
                product={product}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage