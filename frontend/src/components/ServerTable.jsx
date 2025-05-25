
import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Replace with your actual values
const MONDAY_API_KEY = process.env.REACT_APP_MONDAY_API_KEY; // 🔁 Replace with your API key
const BOARD_ID = process.env.BOARD_ID; // 🔁 Replace with your board ID

export default function MondayTableWithExport() {
    const [data, setData] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    const fetchMondayData = async () => {
      const query = `
        query {
          boards(ids: ${BOARD_ID}) {
            items_page {
              items {
                id
                name
                column_values {
                  id
                  title
                  text
                }
              }
            }
          }
        }
      `;
  
      try {
        const res = await axios.post(
          'https://api.monday.com/v2',
          { query },
          {
            headers: {
              Authorization: MONDAY_API_KEY,
              'Content-Type': 'application/json',
            },
          }
        );
  
        const items = res.data.data.boards[0]?.items_page?.items || [];
        const columnsSet = new Set();
  
        const parsedData = items.map((item) => {
          const row = { Name: item.name };
          item.column_values.forEach((col) => {
            const label = col.title || col.id;
            row[label] = col.text || '';
            columnsSet.add(label);
          });
          return row;
        });
  
        const finalHeaders = ['Name', ...Array.from(columnsSet)];
        setHeaders(finalHeaders);
        setData(parsedData);
      } catch (err) {
        setError(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchMondayData();
    }, []);
  
    const downloadCSV = () => {
      const csvRows = [headers.join(',')];
      for (const row of data) {
        const values = headers.map((h) => `"${(row[h] || '').replace(/"/g, '""')}"`);
        csvRows.push(values.join(','));
      }
  
      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'monday-data.csv';
      a.click();
      URL.revokeObjectURL(url);
    };
  
    const downloadPDF = () => {
      const doc = new jsPDF();
      autoTable(doc, {
        head: [headers],
        body: data.map(row => headers.map(h => row[h] || '')),
        styles: { fontSize: 10 },
        headStyles: { fillColor: [29, 78, 216] },
      });
      doc.save("monday-data.pdf");
    };
  
    if (loading) return <p className="p-6 text-gray-600">Loading Monday.com data...</p>;
    if (error) return <p className="p-6 text-red-600">Error: {JSON.stringify(error)}</p>;
  
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold mb-4 text-center text-blue-700">Monday.com Board Data</h2>
  
        {/* ⬆️ Download buttons moved to top */}
        <div className="mb-4 flex justify-center gap-4">
          <button
            onClick={downloadCSV}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Download CSV
          </button>
          <button
            onClick={downloadPDF}
            className="px-5 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
          >
            Download PDF
          </button>
        </div>
  
        {/* 🧱 Scrollable table with fixed header */}
        <div className="overflow-x-auto border rounded-lg max-h-[500px] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="sticky top-0 bg-blue-600 text-white z-10">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  {headers.map((h, j) => (
                    <td key={j} className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
                      {row[h] || ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }