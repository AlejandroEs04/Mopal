export const getPeriod = (date = new Date()) => {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString()

    return `${year}-${month.length === 1 ? '0' + month : month}`
}