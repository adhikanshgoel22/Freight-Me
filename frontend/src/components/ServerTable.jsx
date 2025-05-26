
import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Replace with your actual values
const MONDAY_API_KEY = process.env.REACT_APP_MONDAY_API_KEY;
const BOARD_ID = process.env.REACT_APP_BOARD_ID; // 🔁 Replace with your board ID





const EXPORT_COLUMNS = ['text01', 'text03', 'location9', 'long_text2'];
const DELIVERY_TYPES = ['Panel in Transit', 'Panel with Tech', 'Panel Delivered', 'Panel On Site'];

export default function MondayTableWithExport() {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deliveryTypes, setDeliveryTypes] = useState({});

  const handleDeliveryTypeChange = (rowId, newType) => {
    setDeliveryTypes((prev) => ({
      ...prev,
      [rowId]: newType,
    }));
  };

  const updateDeliveryType = async (rowId) => {
    try {
      const selectedType = deliveryTypes[rowId];
      if (!selectedType) {
        alert('Please select a delivery type before saving.');
        return;
      }

      const ticketRef = data.find(d => d.id === rowId)?.text01 || '';
      const res = await axios.post(`http://localhost:5000/ticket`, {
        text01: ticketRef,
        delivery_type: selectedType,
      });

      if (res.status === 200 || res.status === 201) {
        alert('Delivery type updated!');
      }
    } catch (err) {
      alert('Failed to update delivery type.');
      console.error(err);
    }
  };

  const fetchMondayData = async () => {
    try {
      setLoading(true);

      // 1. Fetch Monday.com data
      const query = `
        query {
          boards(ids: ${BOARD_ID}) {
            items_page {
              items {
                id
                name
                column_values {
                  id
                  text
                  
                }
              }
            }
          }
        }
      `;

      const mondayRes = await axios.post(
        'https://api.monday.com/v2',
        { query },
        {
          headers: {
            Authorization: MONDAY_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      const mondayItems = mondayRes.data.data.boards[0]?.items_page?.items || [];

      // 2. Fetch Supabase delivery types
      const supabaseRes = await axios.get('http://localhost:5000/tickets');
      const ticketMap = {};
      supabaseRes.data.tickets.forEach((t) => {
        ticketMap[t.text01] = t.delivery_type;
      });

      // 3. Merge Monday items with delivery_type from Supabase
      const columnsSet = new Set();
      const parsedData = mondayItems.map((item) => {
        const row = { id: item.id, Name: item.name };
        item.column_values.forEach((col) => {
          const label = col.title || col.id;
          row[label] = col.text || '';
          columnsSet.add(label);
        });

        row.delivery_type = ticketMap[row['text01']] || ''; // Match on `text01`
        return row;
      });

      const finalHeaders = ['Name', ...Array.from(columnsSet)];
      setHeaders(finalHeaders);
      setData(parsedData);

      // 4. Set initial delivery type state
      const typeMap = {};
      parsedData.forEach((row) => {
        typeMap[row.id] = row.delivery_type || '';
      });
      setDeliveryTypes(typeMap);

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

  const downloadRowAsPDF = (row) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Item: ${row.Name}`, 14, 20);

    const rowData = EXPORT_COLUMNS.map(header => [header, row[header] || '—']);

    autoTable(doc, {
      startY: 30,
      head: [['Field', 'Value']],
      body: rowData,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [29, 78, 216] },
    });

    const fileName = row.Name ? `item-${row.Name}.pdf` : 'item.pdf';
    doc.save(fileName);
  };

  const filteredData = data.filter((row) =>
    headers.some((key) =>
      (row[key] || '').toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) return <p className="p-6 text-gray-600">Loading Monday.com data...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {JSON.stringify(error)}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold mb-4 text-center text-blue-700">
        Monday.com Board Data
      </h2>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search by any field..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      <div className="mb-6 flex justify-center">
        <button
          onClick={downloadCSV}
          className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Download CSV
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((row) => (
          <div
            key={row.id}
            className="border rounded-lg shadow p-4 bg-gray-50 hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-blue-700">
                {row.Name || 'Untitled'}
              </h3>
              <button
                onClick={() => downloadRowAsPDF(row)}
                className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                PDF
              </button>
            </div>

            <div className="space-y-2">
              {EXPORT_COLUMNS.map((col, j) => (
                <div key={j} className="text-sm">
                  <span className="font-medium text-gray-700">{col}:</span>{' '}
                  <span className="text-gray-800">{row[col] || '—'}</span>
                </div>
              ))}

              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700">Delivery Type:</label>
                <select
                  value={deliveryTypes[row.id] || ''}
                  onChange={(e) => handleDeliveryTypeChange(row.id, e.target.value)}
                  className="mt-1 w-full px-3 py-1 border rounded-md shadow-sm"
                >
                  <option value="">Select Delivery Type</option>
                  {DELIVERY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => updateDeliveryType(row.id)}
                  className="mt-2 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Save Delivery Type
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
