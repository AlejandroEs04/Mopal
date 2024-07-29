import React from 'react'

const Textarea = ({
    label, 
    name, 
    id = name, 
    value, 
    handleAction, 
}) => {
    return (
        <div className="d-flex flex-column">
            <label htmlFor={id}>{label}</label>
            <textarea 
                id={id} 
                className="form-control"
                value={value}
                onChange={handleAction}
                rows={5}
            ></textarea>
        </div>
    )
}

export default Textarea