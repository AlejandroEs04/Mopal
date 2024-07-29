import styles from '../styles/Spinner.module.css'

const Spinner = ({ margin = true, size = "normal" }) => {
  return (
    <div className={`d-flex justify-content-center ${margin && 'my-5'}`}>
        <span className={`${styles.loader} ${size === 'sm' && styles.loaderSm}`}></span>
    </div>
  )
}

export default Spinner