export const dateFormatter = (isoDate) => {
    const date = new Date(isoDate)
    const localeDateFormat = isoDate.toLocaleDateString('es-ES');

    return localeDateFormat.formatter(date)
}