export const getTotal = (price, discount, quantity, iva) => {
    const subtotal = ((price * (1 - (discount / 100))) * quantity)
    const total = subtotal + (subtotal * (iva / 100))

    return {total: +total.toFixed(2), subtotal: +subtotal.toFixed(2)}
}