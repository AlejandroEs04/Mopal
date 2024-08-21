import React, { useEffect, useState } from 'react'

const SelectOptions = ({ onChange, items, name = '', id = '', selectInfo = 'Seleccione un item', className }) => {
    const [itemsFiltered, setItemsFiltered] = useState([])
    const [filterText, setFilterText] = useState('')
    const [showOptions, setShowOptions] = useState(false)
    
    const handleFilterItems = () => {
        const newItems = items.filter(item => 
            item.Folio.toLowerCase().includes(filterText.toLowerCase()) ||
            item.Name.toLowerCase().includes(filterText.toLowerCase())
        )
        
        setItemsFiltered(newItems)
    }

    const handleSelectItem = (value, text) => {
        setFilterText(text)

        const e = {
            target: {
                value: value, 
                name: name
            }
        }

        onChange(e)
        setFilterText('')
        setShowOptions(false)
    }

    useEffect(() => {
        setItemsFiltered(items)
    }, [])

    useEffect(() => {
        handleFilterItems()
    }, [filterText])

    return (
        <div 
            className={`${className} form-select-options`}
        >
            <div 
                className='input-container' 
                onFocus={() => setShowOptions(true)}
            >
                <input 
                    type="text" 
                    className='input-box' 
                    name={name}
                    id={id}
                    placeholder={selectInfo}
                    value={filterText}
                    onChange={e => setFilterText(e.target.value)}
                />
            </div>
            
            {showOptions && (
                <div className='options-box' onFocus={() => setShowOptions(true)}>
                    {itemsFiltered.map(item => (
                        <button 
                            type='button'
                            onClick={() => handleSelectItem(item.Folio, `${item.Folio} - ${item.Name}`)}
                        >{item.Folio} - {item.Name}</button>
                    ))}
                </div>
            )}
        </div>

    )
}

export default SelectOptions