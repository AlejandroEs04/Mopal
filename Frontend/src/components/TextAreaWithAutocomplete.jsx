import { useEffect, useRef, useState } from "react";
import styles from '../styles/Autocomplete.module.css'
import Dropdown from "./Dropdown";

const TextAreaWithAutocomplete = ({ options, className = '', text = '', handleChangeProp, name }) => {
    const [filteredOptions, setFilteredOptions] = useState([])
    const [showDropdown, setShowDropdown] = useState(false)
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const textAreaRef = useRef(null)

    useEffect(() => {
        const handleKeyDown = (e) => {
            if(showDropdown) {
                if(e.key === 'ArrowDown') {
                    e.preventDefault()
                    setHighlightedIndex((prev) => (prev + 1) % filteredOptions.length)
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault()
                    setHighlightedIndex((prev) => (prev - 1 + filteredOptions.length) % filteredOptions.length)
                } else if (e.key === 'Enter' || e.key === 'Tab') {
                    e.preventDefault()
                    handleSelect(filteredOptions[highlightedIndex])
                }
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [filteredOptions, highlightedIndex, showDropdown])

    const handleChange = (e) => {
        const inputText = e.target.value
        handleChangeProp(e)
        // setText(inputText)

        // Check if user wrote "#"
        const lastWord = inputText.split(' ').pop() || ''

        if(lastWord.trim().startsWith('#')) {
            const query = lastWord.substring(1) // Delete "#"
            const filtered = options.filter(option => 
                option.description.toLocaleLowerCase().includes(query.toLocaleLowerCase())
            )
            setFilteredOptions(filtered)
            setShowDropdown(true)
        } else {
            setShowDropdown(false)
        }
    }

    const setText = (value) => {
        const e = {
            target: {
                value: value, 
                name: name
            }
        }
        handleChangeProp(e)
    }

    const handleSelect = (option) => {
        const words = text.split(' ')
        words[words.length - 1] = `#${option.description}`
        setText(words.join(' ').replace('#', ''))
        setShowDropdown(false)
    }

    return (
        <div className={`${styles.autocomplete_container}`}>
            <textarea 
                ref={textAreaRef}
                value={text}
                name={name}
                onChange={handleChange}
                className={`${className}`}
                placeholder="Observaciones generales"
                rows={4}
            />

            {showDropdown && filteredOptions.length > 0 && (
                <Dropdown 
                    options={filteredOptions}
                    onSelect={handleSelect}
                    highlightedIndex={highlightedIndex}
                />
            )}
        </div>
    )
}

export default TextAreaWithAutocomplete