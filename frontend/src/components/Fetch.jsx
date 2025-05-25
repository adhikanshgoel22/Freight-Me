import { useState } from "react";
import axios from "axios";

function TicketLookup() {
  const [ticket, setTicket] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      setResult(null);
      const res = await axios.post("/api/ticket", { ticketNumber: ticket });
      setResult(res.data.ticket);
    } catch (err) {
      console.error("Error fetching ticket", err);
      setResult({ error: err.response?.data?.error || "Could not fetch ticket" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Ticket Lookup</h1>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter Ticket Number"
            value={ticket}
            onChange={(e) => setTicket(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={fetchTicket}
            disabled={loading || !ticket.trim()}
            className={`py-2 px-4 rounded-lg text-white font-medium transition
              ${loading || !ticket.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? "Loading..." : "Fetch Ticket"}
          </button>
        </div>

        {/* Render result */}
        {result && (
          <div className="mt-6 bg-gray-100 p-4 rounded-lg max-h-80 overflow-auto text-sm text-gray-800">
            {result.error ? (
              <p className="text-red-600">{result.error}</p>
            ) : (
              <div>
                <h2 className="text-lg font-semibold mb-2">Ticket: {result.name}</h2>
                <ul className="list-disc pl-5">
                  {result.column_values.map((field) => (
                    <li key={field.id}>
                      <strong>{field.title}:</strong> {field.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TicketLookup;
