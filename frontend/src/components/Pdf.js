import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoImg from '../pages/logo.jpg'; // Use a small B&W logo or remove

export function generateConnotePDF(row) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'A4' });

  // Header
  doc.setFontSize(18);
  doc.setTextColor(0);
  doc.setFont('helvetica', 'bold');
  doc.text('Delivery Consignment Note', 14, 20);

  // Company Info
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('FreightMe', 14, 27);
  doc.text('projects@installme.com.au', 14, 32);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 38);

  // Receiver Info
  // const receiverName = row[row.Name] || "—";
  const deliveryAddress = row.Name || "—";

  autoTable(doc, {
    startY: 45,
    head: [[ 'Delivery Address']],
    body: [[ deliveryAddress]],
    styles: {
      fontSize: 10,
      textColor: 0,
      lineColor: 0,
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: 0,
      fontStyle: 'bold',
    },
    theme: 'grid',
    margin: { left: 14, right: 14 },
  });

  // Package Details
  const packageData = {
    serial: row["text_mkrmbn8h"] || "—",
    quantity: row["numeric_mkrmh92c"] || "—",
    reference: row["text_mkrmfhjz"] || "—",
    weight: row["weight"] || "—",
    dimensions: `${row["length"] || "—"} x ${row["width"] || "—"} x ${row["height"] || "—"} cm`,
  };

  const tableStartY = doc.lastAutoTable.finalY + 10;
  autoTable(doc, {
    startY: tableStartY,
    head: [['Serial', 'Quantity', 'Reference', 'Weight (kg)', 'Dimensions (cm)']],
    body: [[
      packageData.serial,
      packageData.quantity,
      packageData.reference,
      packageData.weight,
      packageData.dimensions,
    ]],
    styles: {
      fontSize: 10,
      textColor: 0,
      lineColor: 0,
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: 0,
      fontStyle: 'bold',
    },
    theme: 'grid',
    margin: { left: 14, right: 14 },
  });

  // Footer & Signatures
  const signY = doc.lastAutoTable.finalY + 20;
  doc.text('Receiver Signature:', 14, signY);
  doc.line(50, signY, 120, signY);

  doc.text('Driver Signature:', 14, signY + 15);
  doc.line(50, signY + 15, 120, signY + 15);

  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text('FreightMe © - Delivery Consignment - Confidential', 14, 285);

  const fileName = row.Name ? `connote-${row.Name}.pdf` : 'delivery-note.pdf';
  doc.save(fileName);
}
