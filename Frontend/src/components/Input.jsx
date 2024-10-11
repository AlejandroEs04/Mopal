import React from 'react'

const Input = ({
    label, 
    name, 
    id = name, 
    value = '', 
    handleAction, 
    disable = false, 
    type = 'text', 
    placeholder, 
    className = ''
}) => {
    return (
        <div className={`d-flex flex-column ${className}`}>
            <label htmlFor={id}>{label}</label>
            <input
                type={type} 
                id={id} 
                name={name}
                disabled={disable}
                placeholder={placeholder}
                value={value} 
                onChange={e => handleAction(e)}
                className="form-control" 
            />
        </div>
    )
}

export default Input