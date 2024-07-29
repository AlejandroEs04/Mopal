const findNextID = (array, currentId) => {
    const sortArray = array.sort((a, b) => a?.Folio - b?.Folio)

    const currentPosition = sortArray.findIndex(item => item.Folio === +currentId);

    if(currentPosition === -1 || currentPosition === sortArray.length - 1) {
        return currentId
    }  

    const nextId = sortArray[+currentPosition + 1]
    return nextId?.Folio
}

export default findNextID