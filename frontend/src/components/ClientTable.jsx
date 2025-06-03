import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Header from "./Navbar";

const MONDAY_API_KEY = process.env.REACT_APP_MONDAY_API_KEY;
const BOARD_ID = process.env.REACT_APP_BOARD_ID;

const EXPORT_COLUMNS = ['text01', 'text03', 'location9', 'long_text2'];
const DELIVERY_TYPES = ['Panel in Transit', 'Panel with Tech', 'Panel Delivered', 'Panel On Site'];

const ColTitle=['Ticket Number','SKQ','Drop-off Location','PickUp Location'];
export default function ClientTable() {
  const [showReplaceOnly, setShowReplaceOnly] = useState(false);

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
      const res = await axios.post(`https://freight-me-1.onrender.com/ticket`, {
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

      const supabaseRes = await axios.get('https://freight-me-1.onrender.com/tickets');
      const ticketMap = {};
      supabaseRes.data.tickets.forEach((t) => {
        ticketMap[t.text01] = t.delivery_type;
      });

      const columnsSet = new Set();
      const parsedData = mondayItems.map((item) => {
        const row = { id: item.id, Name: item.name };
        item.column_values.forEach((col) => {
          const label = col.title || col.id;
          row[label] = col.text || '';
          columnsSet.add(label);
        });

        row.delivery_type = ticketMap[row['text01']] || '';
        return row;
      });

      const finalHeaders = ['Name', ...Array.from(columnsSet)];
      setHeaders(finalHeaders);
      setData(parsedData);

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

  const redirectToFastCourier = (row) => {
    if (!row['location9'] || !row['long_text2']) {
      alert("Missing pickup or dropoff address.");
      return;
    }

    const pickup = encodeURIComponent(row['location9']);
    const drop = encodeURIComponent(row['long_text2']);
    const length = encodeURIComponent(row['length'] || '10');
    const width = encodeURIComponent(row['width'] || '10');
    const height = encodeURIComponent(row['height'] || '10');
    const weight = encodeURIComponent(row['weight'] || '1');

    localStorage.setItem('fastcourier_package', JSON.stringify({
      pickup: row['location9'],
      drop: row['long_text2'],
      length,
      width,
      height,
      weight,
    }));

    const url = `https://fcapp.fastcourier.com.au/#/package-details?pickup=${pickup}&drop=${drop}&length=${length}&width=${width}&height=${height}&weight=${weight}`;
    window.open(url, '_blank');
  };

 const filteredData = data.filter((row) => {
  const matchesSearch = headers.some((key) =>
    (row[key] || '').toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

    const hasReplaceText =
  Object.values(row).some((value) =>
    typeof value === 'string' &&
    value.toLowerCase().includes('replace entire panel')
  ) || /2$/.test(row['text01']);

  return matchesSearch && (!showReplaceOnly || hasReplaceText);
});


  if (loading) return <p className="p-6 text-gray-600">Loading Monday.com data...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {JSON.stringify(error)}</p>;

  return (
    <div>
      <Header></Header>
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold mb-4 text-center text-blue-700">
        COMMBOX PANELS INVENTORY
      </h2>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
  {/* Left side buttons */}
  <div className="flex gap-3">
    <button
      onClick={() => {
        localStorage.removeItem('user');
        window.location.href = '/';
      }}
      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
    >
      Logout
    </button>

    <button
      onClick={() => setShowReplaceOnly((prev) => !prev)}
      className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
    >
      {showReplaceOnly ? 'Show All Cards' : 'Show "Replace Entire Panel" Only'}
    </button>
  </div>

  {/* Center search bar */}
  <div className="flex justify-center w-full sm:w-auto">
    <input
      type="text"
      placeholder="Search by any field..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full sm:w-[300px] px-4 py-2 border rounded-lg shadow-sm"
    />
  </div>

  {/* Right side button */}
  <div className="flex justify-end">
    <button
      onClick={downloadCSV}
      className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
    >
      Download CSV
    </button>
  </div>
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
    <span className="font-medium text-gray-700">{ColTitle[j]}:</span>{' '}
    <span className="text-gray-800">{row[col] || '—'}</span>
  </div>
))}

              <div className="text-sm mt-3">
  <span className="font-medium text-gray-700">Panel Status:</span>{' '}
  <span className="text-gray-800">
    {deliveryTypes[row.id] || '—'}
  </span>
</div>

<div className="flex gap-2 mt-2">
  <button
    onClick={() => redirectToFastCourier(row)}
    className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
  >
    Go to FastCourier
  </button>
</div>

            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
