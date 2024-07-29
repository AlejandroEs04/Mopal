const getType = (valor) => {
    if(typeof valor === 'string' || typeof valor === 'object') {
        return "'" + valor + "'"
    } else {
        return valor
    }
}

export default getType