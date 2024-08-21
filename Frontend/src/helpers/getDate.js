export const getPeriod = (date = new Date()) => {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString()
    return `${year}-${month.length === 1 ? '0' + month : month}`
}

export const getYear = (date = new Date()) => {
    const year = date.getFullYear()
    return year
}

export const groupByPeriod = (data) => {
    const grouping = _.groupBy(data, element => element.date)
    const sections = _.map(grouping, (items, date) => ({
        date: date, 
        data: items
    }))

    return sections
}