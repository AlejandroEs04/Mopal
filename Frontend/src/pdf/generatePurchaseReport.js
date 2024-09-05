import jsPDF from "jspdf";
import 'jspdf-autotable'
import formatearDinero from "../helpers/formatearDinero";
import formatearFecha from "../helpers/formatearFecha";
import { getTotal } from "../helpers/getValues";

const generatePurchaseReport = (report, title, information) => {
    const doc = new jsPDF();
    let subtotal = 0
    let total = 0

    doc.setFontSize(20);
    doc.text(title, 14, 15);
    doc.setFontSize(12);
    doc.text(information, 14, 22)

    let finalY = 28

    report.purchases.map(purchase => {
        const purchaseColumns = ['Folio', 'Fecha', 'Importe', 'Cliente', 'Usuario']
        const purchaseRows = []
        purchaseRows[0] = [`${purchase.Folio}`, `${formatearFecha(purchase.PurchaseDate)}`, formatearDinero(+purchase.Amount), purchase.SupplierID, purchase.UserID]

        doc.autoTable(purchaseColumns, purchaseRows, {
            startY: finalY,
            styles: { overflow: "linebreak", fontSize: 8 },
            bodyStyles: { valign: "top" },
            theme: "grid"
        })

        finalY = doc.previousAutoTable.finalY + 5;

        const productColumns = ['Folio', 'Nombre', 'Description', 'Descuento', 'Cantidad', 'Precio Lista', 'Subtotal', 'Importe (IVA)']
        const productRow = []

        let purchaseTotal = 0
        let purchaseSubtotal = 0
        let purchaseQuantity = 0

        for(let i = 0; i<purchase.products.length+1;i++) {
            if(i === purchase.products.length) {
                productRow[i] = [
                    '', 
                    '', 
                    '', 
                    'Totales:', 
                    purchaseQuantity, 
                    '', 
                    formatearDinero(purchaseSubtotal), 
                    formatearDinero(purchaseTotal)
                ]
            } else {
                productRow[i] = [
                    purchase.products[i].ProductFolio, 
                    purchase.products[i].Name, 
                    purchase.products[i].Description,       
                    +purchase.products[i].Discount, 
                    purchase.products[i].Quantity, 
                    purchase.products[i].PricePerUnit, 
                    getTotal(
                        purchase.products[i].PricePerUnit, 
                        purchase.products[i].Discount, 
                        purchase.products[i].Quantity, 
                        16
                    ).subtotal, 
                    getTotal(
                        purchase.products[i].PricePerUnit, 
                        purchase.products[i].Discount, 
                        purchase.products[i].Quantity, 
                        16
                    ).total, 
                ]

                purchaseTotal += getTotal(purchase.products[i].PricePerUnit, purchase.products[i].Discount, purchase.products[i].Quantity, 16).total
                purchaseSubtotal += getTotal(purchase.products[i].PricePerUnit, purchase.products[i].Discount, purchase.products[i].Quantity, 16).subtotal
                purchaseQuantity += purchase.products[i].Quantity
        
                total += getTotal(
                    purchase.products[i].PricePerUnit, 
                    purchase.products[i].Discount, 
                    purchase.products[i].Quantity, 
                    16
                ).total
                subtotal += getTotal(
                    purchase.products[i].PricePerUnit, 
                    purchase.products[i].Discount, 
                    purchase.products[i].Quantity, 
                    16
                ).subtotal
            }
        }

        doc.autoTable(productColumns, productRow, {
            startY: finalY,
            styles: { overflow: "linebreak", fontSize: 8 },
            bodyStyles: { valign: "top" },
            theme: "striped"
        })

        finalY = doc.previousAutoTable.finalY + 10;
    })

    finalY = finalY + 4

    doc.setFontSize(20);
    doc.text('Resumen del reporte', 14, finalY)

    finalY = finalY + 2

    const resumeColumns = ['Subtotal', 'total'] 
    const resumeRows = []

    resumeRows[0] = [formatearDinero(+subtotal), formatearDinero(+total)]

    doc.autoTable(resumeColumns, resumeRows, {
        startY: finalY,
        styles: { overflow: "linebreak", fontSize: 9 },
        bodyStyles: { valign: "top" },
    })

    doc.save(`purchase_report_${new Date().getTime()}.pdf`);
}

export default generatePurchaseReport