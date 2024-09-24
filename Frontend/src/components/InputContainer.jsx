import React from 'react'
import formatearDinero from '../helpers/formatearDinero'

const InputContainer = ({ 
        label, 
        name, 
        id = name, 
        value, 
        handleAction, 
        disable = false, 
        type = 'text', 
        placeholder, 
        options, 
        isMoney = false, 
        className = ''
    }) => {
    return (
        <div className={`${className} col-lg-4 d-flex flex-column`}>
            <label htmlFor={id}>{label}</label>

            {type === 'select' ? (
                <select>
                    <option value={0}>Sin Contacto</option>
                    {options?.map(option => (
                        <option key={option.UserID} value={option.UserID}>{`${option.UserID} - ${option.FullName}`}</option>
                    ))}
                </select>
            ) : (    
                <input 
                    type={type} 
                    id={id} 
                    name={name}
                    disabled={disable}
                    placeholder={placeholder}
                    value={isMoney ? formatearDinero(+value) : value} 
                    onChange={e => handleAction(e)}
                    className="form-control" 
                />
            )}
        </div>
    )
}

export default InputContainer