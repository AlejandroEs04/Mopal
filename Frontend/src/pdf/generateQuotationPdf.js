import { jsPDF } from 'jspdf' 
import 'jspdf-autotable'
import formatearDinero from '../helpers/formatearDinero';
import formatearFecha from '../helpers/formatearFecha';

const generateQuotationPdf = (cotizacion, subtotal, iva, total, save = false) => {
    const doc = new jsPDF();

    // Crear Tabla Productos
    const columns = ['#', 'Cant', 'Unid.', 'Descripcion', 'P.Unitario', 'Importe', 'Mon'];

    const rows = [];

    for(let i = 0; i < cotizacion?.Products.length+1; i++) {
        if(i === cotizacion.Products.length) {
            rows[i] = ['', '', '', '', '', 'Subtotal:', formatearDinero(+subtotal), 'USD']
            rows[i+1] = ['', '', '', '', '', 'IVA:', formatearDinero(+iva), 'USD']
            rows[i+2] = ['', '', '', '', '', 'Total:', formatearDinero(+total), 'USD']
        } else {
            rows[i] = [
                `${i+1}`, 
                `${cotizacion.Products[i].Quantity}`, 
                'Pieza',
                `${cotizacion.Products[i].Folio}\n${cotizacion.Products[i].Name}\n${cotizacion.Products[i].Description}\n\n${cotizacion?.Products[i].Observations}`, 
               `${formatearDinero(+cotizacion.Products[i].PricePerUnit - (+cotizacion.Products[i].PricePerUnit * (+cotizacion.Products[i].Discount / 100)))}`, 
                `${formatearDinero((+cotizacion.Products[i].PricePerUnit * +cotizacion.Products[i].Quantity) - ((+cotizacion.Products[i].PricePerUnit * +cotizacion.Products[i].Quantity) * (+cotizacion.Products[i].Discount / 100)))}`, 
                'USD'
            ]
        }
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
    doc.text(`${cotizacion.Folio}`, 196, 28, null, null, "right")
    doc.setTextColor(0);
    doc.setFontSize(10)
    doc.text('Emitida', 196, 33, null, null, "right")
    doc.text(formatearFecha(cotizacion.SaleDate ?? formatearFecha(new Date())), 196, 38, null, null, "right")
    
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold");
    doc.text('Cotizado a:', 15, 50)
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150);
    doc.text(`${cotizacion.BusinessName}`, 15, 56)
    doc.setTextColor(0);
    doc.text(`${cotizacion.Address}`, 15, 62)
    doc.text(`RFC: ${cotizacion.RFC}`, 15, 68)
    
    doc.setFont("helvetica", "bold");
    
    doc.text('Atencion a:', 15, 75)
    
    if(cotizacion.CustomerUserID) {
        doc.text('Contacto:', 15, 82)
        doc.setFont("helvetica", "normal");
        doc.text(cotizacion.CustomerUserName, 50, 82)
    }

    
    doc.setFont("helvetica", "normal");
    doc.text(cotizacion.User, 50, 75)

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

    doc.setFontSize(10);

    doc.setFont("helvetica", "bold");
    doc.text("Observaciones", 15, finalY + 10)
    doc.setFont("helvetica", "normal");

    const lines = doc.splitTextToSize(cotizacion.Observation.length > 0 ? cotizacion.Observation : 'No hay observaciones', 90);

    const x = 15;
    const y = finalY + 16;

    for (let i = 0; i < lines.length; i++) {
        doc.text(lines[i], x, y + (i * 5));
    }

    if(save) {
        doc.save(`Cotizacion_${cotizacion.Folio}.pdf`);
    } else {
        const pdfBlob = doc.output('blob'); // Obtén el PDF como un blob
        return pdfBlob;
    }
}

export default generateQuotationPdf