import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoImg from '../pages/logo.jpg'; // <-- Small logo file path or base64

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

  // Logo
  try {
    doc.addImage(logoImg, 'PNG', 150, 10, 60, 35);
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

  // Table Data
  const tableData = EXPORT_COLUMNS.map((col, i) => [
    ColTitle[i],
    row[col] || '—',
  ]);

  // Estimate height after table (Y position = startY + rowCount * rowHeight + some margin)
  const tableStartY = 60;
  const rowHeight = 8;
  const rowCount = tableData.length + 1; // +1 for header row
  const estimatedTableEndY = tableStartY + rowCount * rowHeight + 10;

  // Render Table (no need to track result)
  autoTable(doc, {
    startY: tableStartY,
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

  // Signature area at bottom of the page
const pageHeight = doc.internal.pageSize.height;
const signatureY = pageHeight - 30; // 30 units from bottom

doc.setFontSize(12);
doc.setTextColor(0);
doc.text('Signature:', 14, signatureY);
doc.line(40, signatureY, 140, signatureY); // horizontal line
doc.setFontSize(10);
doc.setTextColor(120);
doc.text('Receiver / Technician Name & Signature', 14, signatureY + 6);


  // Footer
  // const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text('CommBox © - Confidential Delivery Information', 14, pageHeight - 10);

  const fileName = row.Name ? `invoice-${row.Name}.pdf` : 'invoice.pdf';
  doc.save(fileName);
}
