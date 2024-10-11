import styles from '../styles/Autocomplete.module.css'

const Dropdown = ({ options, onSelect, highlightedIndex }) => {
    return (
        <div className={styles.dropdown}>
            {options.map((option, index) => (
                <div
                    key={option.id}
                    className={`${styles.dropdown_item} ${index === highlightedIndex && styles.highlighted}`}
                    onMouseDown={() => onSelect(option)}
                >
                    {option.description}
                </div>
            ))}
        </div>
    )
}

export default Dropdown