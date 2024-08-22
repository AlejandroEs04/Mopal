import jsPDF from "jspdf";
import 'jspdf-autotable'
import formatearDinero from "../helpers/formatearDinero";
import formatearFecha from "../helpers/formatearFecha";
import { getTotal } from "../helpers/getValues";

const generateReport = (report, title, information) => {
    const doc = new jsPDF();
    let subtotal = 0
    let total = 0

    doc.setFontSize(20);
    doc.text(title, 14, 15);
    doc.setFontSize(12);
    doc.text(information, 14, 22)

    let finalY = 28

    report.sales.map(sale => {
        const saleColumns = ['Folio', 'Fecha', 'Importe', 'Cliente', 'Usuario']
        const saleRows = []
        saleRows[0] = [`${sale.Folio}`, `${formatearFecha(sale.SaleDate)}`, formatearDinero(+sale.Amount), sale.CustomerID, sale.UserID]

        doc.autoTable(saleColumns, saleRows, {
            startY: finalY,
            styles: { overflow: "linebreak", fontSize: 8 },
            bodyStyles: { valign: "top" },
            theme: "striped"
        })

        finalY = doc.previousAutoTable.finalY + 5;

        const productColumns = ['Folio', 'Nombre', 'Description', 'Descuento', 'Cantidad', 'Precio Lista', 'Subtotal', 'Importe (IVA)']
        const productRow = []

        let saleTotal = 0
        let saleSubtotal = 0
        let saleQuantity = 0

        for(let i = 0; i<sale.products.length+1;i++) {
            if(i === sale.products.length) {
                productRow[i] = [
                    '', 
                    '', 
                    '', 
                    'Totales:', 
                    saleQuantity, 
                    '', 
                    formatearDinero(saleSubtotal), 
                    formatearDinero(saleTotal)
                ]
            } else {
                productRow[i] = [
                    sale.products[i].ProductFolio, 
                    sale.products[i].Name, 
                    sale.products[i].Description, 
                    sale.products[i].Discount, 
                    sale.products[i].Quantity, 
                    sale.products[i].PricePerUnit, 
                    getTotal(
                        sale.products[i].PricePerUnit, 
                        sale.products[i].Discount, 
                        sale.products[i].Quantity, 
                        16
                    ).subtotal, 
                    getTotal(
                        sale.products[i].PricePerUnit, 
                        sale.products[i].Discount, 
                        sale.products[i].Quantity, 
                        16
                    ).total, 
                ]

                saleTotal += getTotal(sale.products[i].PricePerUnit, sale.products[i].Discount, sale.products[i].Quantity, 16).total
                saleSubtotal += getTotal(sale.products[i].PricePerUnit, sale.products[i].Discount, sale.products[i].Quantity, 16).subtotal
                saleQuantity += sale.products[i].Quantity
        
                total += getTotal(
                    sale.products[i].PricePerUnit, 
                    sale.products[i].Discount, 
                    sale.products[i].Quantity, 
                    16
                ).total
                subtotal += getTotal(
                    sale.products[i].PricePerUnit, 
                    sale.products[i].Discount, 
                    sale.products[i].Quantity, 
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

    doc.save(`sale_report_${new Date().getTime()}.pdf`);
}

export default generateReport