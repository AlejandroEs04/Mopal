import styles from '../styles/Carousel.module.css'

const Carouel = () => {
  return (
    <div className={`carousel slide`} data-bs-ride="carousel">
        <div className={`carousel-inner`}>
            <div className={`carousel-item active  ${styles.divImg}`}>
                <img src="/img/Bg1.jpg" className="d-block" alt="Imagen 1 del carrousel"/>
                <div className={styles.bg}></div>
                <div className={`${styles.info}`}>
                    <h1>Mopal Grupo S.A. de C.V.</h1>
                    <h2>Soluciones con calidad</h2>
                    <p>Las mejores marcas en cuanto a herramientas de automatizacion industrial</p>
                    <a href="/productos" className={`${styles.btnCatalogo} ${styles.btn}`}>Catalogo</a>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Carouel