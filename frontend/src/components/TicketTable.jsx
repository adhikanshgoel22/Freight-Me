import { useState } from 'react';
import axios from 'axios';

import jsPDF from 'jspdf'

import autoTable from 'jspdf-autotable';


const MONDAY_API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjI3Mjc3Nzc3MiwiYWFpIjoxMSwidWlkIjozNTA3NzQ1NywiaWFkIjoiMjAyMy0wOC0wM1QwMzo0OTowMC4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTIyMzY2MzMsInJnbiI6InVzZTEifQ.OyF0eFvOp22lA-VE5uN9aA6tbOO-qeudghR_JAqFBQc"; // 🔁 Your Monday API Key
const BOARD_ID = 2711341853; // 🔁 Your Board ID
const TICKET_COLUMN_ID = 'text01'; // 🔁 Column ID to search by

export default function TicketTable() {
  const [ticket, setTicket] = useState('')
  const [loading, setLoading] = useState(false)
  const [match, setMatch] = useState(null)
  const [error, setError] = useState(null)

  const handleSearch = async () => {
    setLoading(true)
    setError(null)
    setMatch(null)

    const query = `
      query {
        boards(ids: ${BOARD_ID}) {
          items_page(limit: 100) {
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
    `

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
      )

      const items = res.data?.data?.boards[0]?.items_page?.items || []

      const found = items.find(item =>
        item.column_values.find(
          col => col.id === TICKET_COLUMN_ID && col.text?.trim() === ticket.trim()
        )
      )

      if (found) {
        setMatch(found)
      } else {
        setError('No matching ticket found.')
      }
    } catch (err) {
      console.error(err)
      setError('Error fetching data')
    } finally {
      setLoading(false)
    }
  }

  const downloadPDF = () => {
    if (!match) return;
  
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Ticket: ${match.name}`, 14, 20);
  
    const rows = match.column_values.map(col => [col.title, col.text || '—']);
  
    autoTable(doc, {
      startY: 30,
      head: [['Column Title', 'Value']],
      body: rows,
      styles: { fontSize: 10 },
      headStyles: {
        fillColor: [29, 78, 216],
        textColor: 255,
        halign: 'left',
      },
    });
  
    doc.save(`ticket-${ticket}.pdf`);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-center text-blue-700">Ticket Lookup</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="flex-1 border p-2 rounded"
          placeholder="Enter Ticket Number"
          value={ticket}
          onChange={(e) => setTicket(e.target.value)}
        />
        <button
          onClick={handleSearch}
          disabled={!ticket || loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {match && (
        <>
          {/* Download Button at Top */}
          <div className="flex justify-end mb-2">
            <button
              onClick={downloadPDF}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Download PDF
            </button>
          </div>

          <div className="overflow-x-auto bg-gray-100 p-4 rounded">
            <h3 className="text-lg font-bold mb-4 text-center">Item: {match.name}</h3>
            <table className="min-w-full bg-white border border-gray-300 text-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Column Title</th>
                  <th className="px-4 py-2 text-left">Value</th>
                </tr>
              </thead>
              <tbody>
                {match.column_values.map(col => (
                  <tr key={col.id} className="border-t border-gray-200">
                    <td className="px-4 py-2 font-medium text-gray-700">{col.title}</td>
                    <td className="px-4 py-2 text-gray-800">{col.text || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
