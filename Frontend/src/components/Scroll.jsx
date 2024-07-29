import styles from '../styles/Scroll.module.css'

const Scroll = ({children, xscroll, yscroll, shadow = false}) => {
  return (
    <div className={`${styles.scrollContainer} ${shadow && 'shadow'}`}>
      <div className={`${styles.scroll}`}>
        {children}
      </div>
    </div>
  )
}

export default Scroll