import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoImg from '../pages/logo.jpg'; // <-- You must have a small logo file (base64 or path)

const EXPORT_COLUMNS = [
  'group_title',
  'dropdown_mkrmqfte',
  'text_mkrmbn8h',
  'numeric_mkrmh92c',
  'text_mkrma2f0',
  'text_mkrmfhjz',
  'date_mkrmrazc',
  'status',
];

const ColTitle = [
  'Group',
  'SKU',
  'Serial No.',
  'Quantity',
  'Issues',
  'Reference',
  'ETA',
  'Status',
];

export function generateCustomPDF(row) {
  const doc = new jsPDF();

  // Add Logo
  const logoWidth = 40;
  const logoHeight = 15;
  try {
    doc.addImage(logoImg, 'PNG', 150, 10, logoWidth, logoHeight);
  } catch (e) {
    console.warn("Logo couldn't be added:", e.message);
  }

  // Header
  doc.setFontSize(20);
  doc.setTextColor(33, 37, 41);
  doc.text('CommBox Delivery Invoice', 14, 20);

  // Contact Info
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('CommBox Pty Ltd', 14, 28);
  doc.text('support@commbox.com.au | +61 1300 132 269', 14, 33);

  // Invoice Info
  doc.setFontSize(11);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 42);
  doc.text(`Panel ID: ${row.Name || 'Untitled'}`, 14, 48);

  // Build table data
  const tableData = EXPORT_COLUMNS.map((col, i) => [
    ColTitle[i],
    row[col] || '—',
  ]);

  // Render table and capture finalY
  const result = autoTable(doc, {
    startY: 60,
    head: [['Field', 'Details']],
    body: tableData,
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: {
      fillColor: [22, 82, 240],
      textColor: 255,
      halign: 'left',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { left: 14, right: 14 },
    theme: 'striped',
  });

  const afterTableY = result.finalY + 20;

  // Signature area
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text('Signature:', 14, afterTableY);
  doc.line(40, afterTableY, 140, afterTableY); // signature line
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text('Receiver / Technician Name & Signature', 14, afterTableY + 6);

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text(
    'CommBox © - Confidential Delivery Information',
    14,
    pageHeight - 10
  );

  const fileName = row.Name ? `invoice-${row.Name}.pdf` : 'invoice.pdf';
  doc.save(fileName);
}
