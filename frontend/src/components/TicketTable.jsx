import { useState } from "react";
import axios from "axios";

function TicketTable() {
  const [ticket, setTicket] = useState("");
  const [loading, setLoading] = useState(false);
  const [itemData, setItemData] = useState(null);
  const [error, setError] = useState(null);

  const fetchTicket = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post("/api/ticket", { ticketNumber: ticket });
      const item = res.data.data?.items?.[0];
      setItemData(item || null);
    } catch (err) {
      setError("Failed to fetch ticket");
      setItemData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Monday Ticket Lookup</h2>
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={ticket}
          onChange={(e) => setTicket(e.target.value)}
          placeholder="Enter Ticket ID"
          className="border p-2 rounded w-full"
        />
        <button
          onClick={fetchTicket}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Loading..." : "Fetch"}
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {itemData ? (
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Field</th>
                <th className="px-4 py-2 text-left">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2 font-semibold">Name</td>
                <td className="border px-4 py-2">{itemData.name}</td>
              </tr>
              {itemData.column_values.map((col) => (
                <tr key={col.id}>
                  <td className="border px-4 py-2 font-medium">{col.id}</td>
                  <td className="border px-4 py-2">{col.text || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && <p className="text-gray-500">No data found.</p>
      )}
    </div>
  );
}

export default TicketTable;
