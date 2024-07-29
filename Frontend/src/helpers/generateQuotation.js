import { jsPDF } from 'jspdf' 
import 'jspdf-autotable'
import formatearDinero from './formatearDinero';
import formatearFecha from './formatearFecha';

const generateQuotation = (cotizacion, subtotal, iva, total, save = false) => {
    const doc = new jsPDF();

    // Crear Tabla Productos
    const columns = ['#', 'Cant', 'Unid.', 'Clave', 'Descripcion', 'P.Unitario', 'Importe', 'Mon'];

    const rows = [];

    for(let i = 0; i < cotizacion.products.length; i++) {
        rows[i] = [
            `${i+1}`, 
            `${cotizacion.products[i].Quantity}`, 
            'Pieza',
            `${cotizacion.products[i].ProductFolio}`, 
            `${cotizacion.products[i].ProductName}\n${cotizacion.products[i].Description}`, 
            `${formatearDinero(cotizacion.products[i].PricePerUnit * (cotizacion.products[i].Percentage / 100))}`, 
            `${formatearDinero((cotizacion.products[i].PricePerUnit * cotizacion.products[i].Quantity ) * (cotizacion.products[i].Percentage / 100))}`, 
            'USD'
        ]
    }

    doc.addImage("https://res.cloudinary.com/dmap6p5wl/image/upload/v1715021801/xfbn1wn5v3eihljrltrp.png", "PNG", 15, 15, 30, 20);
    doc.setFontSize(12);
    doc.text('MOPAL GRUPO S.A. DE C.V.', 46, 18);
    doc.setFontSize(9);
    doc.text('Carlos Salazar #1930 Pte.', 46, 22);
    doc.text('Col. Centro C.P 64000', 46, 26);
    doc.text('Monterrey, Nuevo Leon', 46, 30);
    doc.text('R.F.C: MGR150224B26', 46, 34);

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text('Cotizacion', 196,20, null, null, "right")
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text('Folio: ', 160, 28)
    doc.setFontSize(16)
    doc.setTextColor(100);
    doc.text(`${cotizacion.ID}`, 196, 28, null, null, "right")
    doc.setTextColor(0);
    doc.setFontSize(10)
    doc.text('Emitida', 196, 33, null, null, "right")
    doc.text(formatearFecha(Date.now()), 196, 38, null, null, "right")
    
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold");
    doc.text('Cotizado a:', 15, 50)
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150);
    doc.text(`${cotizacion.CustomerName ?? cotizacion.SupplierName}`, 15, 56)
    doc.setTextColor(0);
    doc.text(`${cotizacion.Address}`, 15, 62)
    doc.text(`RFC: ${cotizacion.CustomerRFC ?? cotizacion.SupplierRFC}`, 15, 68)
    
    doc.setFont("helvetica", "bold");
    
    doc.text('Atencion a:', 15, 75)
    
    if(cotizacion.CustomerUserID) {
        doc.text('Contacto:', 15, 82)
        doc.setFont("helvetica", "normal");
        doc.text(cotizacion.CustomerUserName, 50, 82)
    }

    doc.setFont("helvetica", "normal");
    doc.text(cotizacion.UserFullName, 50, 75)

    doc.autoTable(columns, rows, {
        startY: 88,
        styles: { overflow: "linebreak" },
        bodyStyles: { valign: "top" },
        theme: "striped",
        didDrawPage: function (data) {
            doc.line(15, 283, 196, 283); 
            doc.setFontSize(8)
            doc.text('MOPAL GRUPO   RFC:MGR150224B26', 15, 287)
            doc.setFontSize(6)
            doc.setFont("helvetica", "italic");
            doc.text('Carlos Salazar Poniente 1930, Monterrey Centro, Del Monterrey, Monterrey, Nuevo Leon, Mexico, CP. 64000', 15, 290)
            
        }
    })

    var finalY = doc.previousAutoTable.finalY;

    if(finalY <= 180) {
        doc.setFontSize(10)
        doc.setFont("helvetica", "bold");
        doc.text('Subtotal: ', 15, finalY + 8);
        doc.setFont("helvetica", "normal");
        doc.text(formatearDinero(subtotal), 50, finalY + 8);
        doc.text('USD', 75, finalY + 8);
        doc.setFont("helvetica", "bold");
        doc.text('IVA ($): ', 15, finalY + 14);
        doc.setFont("helvetica", "normal");
        doc.text(formatearDinero(iva), 50, finalY + 14);
        doc.text('USD', 75, finalY + 14);
        doc.setFont("helvetica", "bold");
        doc.text('Total: ', 15, finalY + 20);
        doc.setFont("helvetica", "normal");
        doc.text(formatearDinero(total), 50, finalY + 20);
        doc.text('USD', 75, finalY + 20);
    } else {
        doc.addPage()

        doc.addImage("https://res.cloudinary.com/dmap6p5wl/image/upload/v1715021801/xfbn1wn5v3eihljrltrp.png", "PNG", 15, 15, 30, 20);
        doc.setFontSize(12);
        doc.text('MOPAL GRUPO S.A. DE C.V.', 46, 18);
        doc.setFontSize(9);
        doc.text('Carlos Salazar #1930 Pte.', 46, 22);
        doc.text('Col. Centro C.P 64000', 46, 26);
        doc.text('Monterrey, Nuevo Leon', 46, 30);
        doc.text('R.F.C: MGR150224B26', 46, 34);

        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text('Orden de compra', 196,20, null, null, "right")
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text('Folio: ', 160, 28)
        doc.setFontSize(16)
        doc.setTextColor(100);
        doc.text(`${cotizacion.Folio}`, 196, 28, null, null, "right")
        doc.setTextColor(0);
        doc.setFontSize(10)
        doc.text('Por surtir', 196, 33, null, null, "right")
        doc.text(formatearFecha(Date.now()), 196, 38, null, null, "right")

        doc.setFontSize(10)
        doc.setFont("helvetica", "bold");
        doc.text('Subtotal: ', 15, 48);
        doc.setFont("helvetica", "normal");
        doc.text(formatearDinero(subtotal), 50, 48);
        doc.text('USD', 90, 48);
        doc.setFont("helvetica", "bold");
        doc.text('IVA ($): ', 15, 54);
        doc.setFont("helvetica", "normal");
        doc.text(formatearDinero(iva), 50, 54);
        doc.text('USD', 90, 54);
        doc.setFont("helvetica", "bold");
        doc.text('Total: ', 15, 74);
        doc.setFont("helvetica", "normal");
        doc.text(formatearDinero(total), 50, 54);
        doc.text('USD', 90, 54);
    }

    if(save) {
        doc.save(`Cotizacion_${cotizacion.ID})}.pdf`);
    } else {
        const pdfBlob = doc.output('blob'); // Obtén el PDF como un blob
        return pdfBlob;
    }

}

export default generateQuotation