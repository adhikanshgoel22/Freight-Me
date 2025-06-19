import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Header from "./Navbar";
import { useNavigate, Link } from "react-router-dom";
import ClientCardModal from "./ClientCardModal.jsx";
import { generateConnotePDF } from "./Pdf.js";
const MONDAY_API_KEY = process.env.REACT_APP_MONDAY_API_KEY;
const BOARD_ID = process.env.REACT_APP_BOARD_ID;

const EXPORT_COLUMNS = ['dropdown_mkrmqfte', 'text_mkrmbn8h', 'numeric_mkrmh92c','text_mkrma2f0','text_mkrmfhjz','date_mkrmrazc','status'];
const ColTitle = ['SKU', 'Serial', 'Qty', 'Issues', 'Reference', 'ETA', 'Status'];

export default function ClientTable() {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [showReplaceOnly, setShowReplaceOnly] = useState(false);
  const [userHash, setUserHash] = useState('');
  const [user, setUser] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
    setUser(storedUser);
    if (!storedUser) {
      navigate('/login');
    } else {
      const identifier = storedUser?.email || storedUser?.username || 'guest';
      (async () => {
        const encoder = new TextEncoder();
        const data = encoder.encode(identifier);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        setUserHash(hashArray.map(b => b.toString(16).padStart(2, '0')).join(''));
      })();
    }
  }, [navigate]);

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

      const columnsSet = new Set();
      const parsedData = mondayItems.map((item) => {
        const row = { id: item.id, Name: item.name };
        item.column_values.forEach((col) => {
          const label = col.title || col.id;
          row[label] = col.text || '';
          columnsSet.add(label);
        });
        return row;
      });

      setHeaders(['Name', ...Array.from(columnsSet)]);
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

  const filteredData = data.filter((row) => {
  const status = (row['status'] || 'Unknown').trim().toLowerCase();

  const matchesSearch = headers.some((key) =>
    (row[key] || '').toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const matchesStatus =
    statusFilter === "All" || status === statusFilter.toLowerCase();

  const hasReplaceText = Object.values(row).some(
    (value) => typeof value === 'string' && value.toLowerCase().includes('replace entire panel')
  ) || /2$/.test(row['text01']);

  return matchesSearch && matchesStatus && (!showReplaceOnly || hasReplaceText);
});

// const matchesStatus = statusFilter === "All" || status === statusFilter.toLowerCase();
  const statusColorMap = {
    'delivered': 'bg-green-100',
    'panel in transit': 'bg-blue-100',
    'pending pickup': 'bg-red-100',
    'unknown': 'bg-yellow-100',
  };

  if (loading) {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-white">
      <div className="w-2/3 max-w-md">
        <div className="relative h-3 w-full bg-gray-200 rounded-full overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-blue-500 animate-loading-bar w-1/2"></div>
        </div>
        <p className="mt-4 text-gray-600 text-center text-lg">Loading data, please wait...</p>
      </div>
    </div>
  );
}

  if (error) return <p className="p-6 text-red-600">Error: {JSON.stringify(error)}</p>;

  return (
    <div className=" bg-blue-300 ">
      <Header />
      <div className="max-w-6xl mx-auto p-6shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold mb-4 text-center text-blue-700">
          COMMBOX PANELS INVENTORY
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="flex gap-3">
            <Link to={`/booking/${userHash}`}>
              <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">
                Back to Booking Page
              </button>
            </Link>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded shadow-sm text-l bg-blue-200"
          >
            <option value="All">All</option>
            <option value="Delivered">Delivered</option>
            <option value="Panel in Transit">Panel in Transit</option>
            <option value="Pending Pickup">Pending Pickup</option>
            <option value="Unknown">Unknown</option>
          </select>
          <div className="flex justify-center w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by any field..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-[300px] px-4 py-2 border rounded-lg shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((row) => {
            const status = (row['status'] || 'Unknown').trim().toLowerCase();
            const statusColor = statusColorMap[status] || 'bg-yellow-100';

            return (
              <div
                key={row.id}
                onClick={() => setSelectedCard(row)}
                className={`border rounded-lg shadow p-4 hover:shadow-md transition cursor-pointer ${statusColor}`}
              >
                <h3 className="text-lg font-semibold text-blue-700">
                  {row.Name || "Untitled"}
                </h3>
                <div className="space-y-1 mt-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-medium">Serial:</span>
                    <span className="text-gray-800">{row["text_mkrmbn8h"] || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-medium">Reference:</span>
                    <span className="text-gray-800">{row["text_mkrmfhjz"] || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-medium">Status:</span>
                    <span className="text-gray-800">{row["status"] || "—"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal */}
        <ClientCardModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onDownload={generateConnotePDF}
          EXPORT_COLUMNS={EXPORT_COLUMNS}
          ColTitle={ColTitle}
          disableFastCourier={true}
          onSave={false}
          onChange={false}
        />
      </div>
    </div>
  );
}
