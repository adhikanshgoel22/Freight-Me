import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Navbar";
import { useNavigate } from "react-router-dom";
import { generateCustomPDF } from "./Pdf.js";
import CardModal from "./CardModal";

const MONDAY_API_KEY = process.env.REACT_APP_MONDAY_API_KEY;
const BOARD_ID = process.env.REACT_APP_BOARD_ID;

const EXPORT_COLUMNS = [
  "dropdown_mkrmqfte",
  "text_mkrmbn8h",
  "numeric_mkrmh92c",
  "text_mkrma2f0",
  "text_mkrmfhjz",
  "date_mkrmrazc",
  "status",
];

const ColTitle = ["SKU", "Serial", "Qty", "Issues", "Reference", "ETA", "Status"];

export default function MondayTableWithExport() {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showReplaceOnly, setShowReplaceOnly] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const navigate = useNavigate();

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
        "https://api.monday.com/v2",
        { query },
        {
          headers: {
            Authorization: MONDAY_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      const mondayItems = mondayRes.data.data.boards[0]?.items_page?.items || [];

      const supabaseRes = await axios.get("https://freight-me-1.onrender.com/tickets");
      const ticketMap = {};
      supabaseRes.data.tickets.forEach((t) => {
        ticketMap[t.text01] = t.delivery_type;
      });

      const columnsSet = new Set();
      const parsedData = mondayItems.map((item) => {
        const row = { id: item.id, Name: item.name };
        item.column_values.forEach((col) => {
          const label = col.title || col.id;
          row[label] = col.text || "";
          columnsSet.add(label);
        });

        row.delivery_type = ticketMap[row["text01"]] || "";
        return row;
      });

      const finalHeaders = ["Name", ...Array.from(columnsSet)];
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

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const redirectToFastCourier = (row) => {
    if (!row["location9"] || !row["long_text2"]) {
      alert("Missing pickup or dropoff address.");
      return;
    }

    const pickup = encodeURIComponent(row["location9"]);
    const drop = encodeURIComponent(row["long_text2"]);
    const length = encodeURIComponent(row["length"] || "10");
    const width = encodeURIComponent(row["width"] || "10");
    const height = encodeURIComponent(row["height"] || "10");
    const weight = encodeURIComponent(row["weight"] || "1");

    const url = `https://fcapp.fastcourier.com.au/#/package-details?pickup=${pickup}&drop=${drop}&length=${length}&width=${width}&height=${height}&weight=${weight}`;
    window.open(url, "_blank");
  };

  const downloadCSV = () => {
    const csvRows = [headers.join(",")];
    for (const row of data) {
      const values = headers.map((h) => `"${(row[h] || "").replace(/"/g, '""')}"`);
      csvRows.push(values.join(","));
    }

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "monday-data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredData = data.filter((row) => {
    const matchesSearch = headers.some((key) =>
      (row[key] || "").toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    const hasReplaceText =
      Object.values(row).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes("replace entire panel")
      ) || /2$/.test(row["text01"]);

    const status = (row["status"] || "Unknown").trim().toLowerCase();
    const matchesStatus = statusFilter === "All" || status === statusFilter.toLowerCase();

    return matchesSearch && (!showReplaceOnly || hasReplaceText) && matchesStatus;
  });

  const statusColorMap = {
    "delivered": "bg-green-100",
    "panel in transit": "bg-blue-100",
    "pending pickup": "bg-red-100",
    "unknown": "bg-yellow-100",
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
    <div className="bg-blue-300 min-h-screen">
      <Header />
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-semibold mb-4 text-center text-blue-800">
          COMMBOX PANELS INVENTORY
        </h2>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <button
            onClick={() => setShowReplaceOnly((prev) => !prev)}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
          >
            {showReplaceOnly ? "Show All Cards" : 'Show "Replace Entire Panel" Only'}
          </button>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded shadow-sm text-sm  bg-blue-200"
          >
            <option value="All">All</option>
            <option value="Delivered">Delivered</option>
            <option value="Panel in Transit">Panel in Transit</option>
            <option value="Pending Pickup">Pending Pickup</option>
            <option value="Unknown">Unknown</option>
          </select>

          <input
            type="text"
            placeholder="Search by any field..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-[300px] px-4 py-2 border rounded-lg shadow-sm"
          />

          <button
            onClick={downloadCSV}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Download CSV
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((row) => {
            const status = (row["status"] || "Unknown").trim().toLowerCase();
            const statusColor = statusColorMap[status] || "bg-yellow-100";

            return (
              <div
                key={row.id}
                onClick={() => setSelectedCard(row)}
                className={`rounded-lg shadow-md p-4 border ${statusColor} cursor-pointer hover:shadow-lg transition`}
              >
                <h3 className="text-lg font-semibold text-blue-800 truncate mb-2">
                  {row.Name || "Untitled"}
                </h3>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Serial:</span>
                    <span className="text-gray-800 text-right">{row["text_mkrmbn8h"] || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Reference:</span>
                    <span className="text-gray-800 text-right">{row["text_mkrmfhjz"] || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Status:</span>
                    <span className="text-gray-800 text-right">{row["status"] || "Unknown"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal */}
        <CardModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onDownload={generateCustomPDF}
          onCourier={redirectToFastCourier}
          EXPORT_COLUMNS={EXPORT_COLUMNS}
          ColTitle={ColTitle}
        />
      </div>
    </div>
  );
}
