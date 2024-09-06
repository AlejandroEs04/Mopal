import { type } from "os"

const getType = (valor) => {
    if(valor === null || !valor) {
        return 'null'
    } else if(typeof valor === 'string' || typeof valor === 'object') {
        return "'" + valor + "'"
    } else {
        return valor
    }
}

export default getType