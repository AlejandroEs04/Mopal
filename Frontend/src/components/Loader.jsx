import styles from '../styles/Loader.module.css'

const Loader = () => {
  return (
    <div className='d-flex align-item-center justify-content-center gap-2 my-5'>
        <h1 className='fs-4 m-0'>Mopal TIM</h1>
        <div className={styles.loader}></div>
    </div>
  )
}

export default Loader