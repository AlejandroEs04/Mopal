import jsPDF from "jspdf";
import 'jspdf-autotable'
import formatearDinero from "../helpers/formatearDinero";
import formatearFecha from "../helpers/formatearFecha";

const generateReport = (report, title, information) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Reporte de ventas", 10, 15);
    doc.setFontSize(12);
    doc.text("Reporte de las ventas", 10, 22)

    let finalY = 24

    report.sales.map(sale => {
        const saleColumns = ['Folio', 'Fecha', 'Importe', 'Cliente', 'Usuario']
        const saleRows = [sale.Folio, formatearFecha(sale.SaleDate), formatearDinero(+sale.Amount), sale.CustomerID, sale.UserID]

        doc.autoTable(saleColumns, saleRows, {
            startY: finalY,
            styles: { overflow: "linebreak" },
            bodyStyles: { valign: "top" },
            theme: "striped"
        })

        finalY = doc.previousAutoTable.finalY;
    })
}

export default generateReport