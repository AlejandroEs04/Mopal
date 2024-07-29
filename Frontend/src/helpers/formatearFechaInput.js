const formatearFechaInput = (date) => {
    return new Date(date).getFullYear() +"-"+ (new Date(date).getMonth() + 1).toString().padStart(2, '0') +"-"+new Date(date).getDay().toString().padStart(2, '0');
}

export default formatearFechaInput;
