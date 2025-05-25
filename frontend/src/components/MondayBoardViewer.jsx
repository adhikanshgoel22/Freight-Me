import { useEffect, useState } from 'react';
import axios from 'axios';

const MONDAY_API_KEY = "";; // Replace with your Monday.com API key
const BOARD_ID =  process.env.BOARD_ID;        // Replace with your board ID (number)

export default function MondayBoardInfo() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoardData = async () => {
      const query = `
        query {
          boards(ids: ${BOARD_ID}) {
            id
            name
            groups {
              id
              title
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

        setData(res.data.data);
      } catch (err) {
        setError(err.response?.data || err.message);
      }
    };

    fetchBoardData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Monday.com Board Info</h1>

      {error && <p className="text-red-500">Error: {JSON.stringify(error)}</p>}

      {data ? (
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
