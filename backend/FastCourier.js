import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const MONDAY_API_TOKEN = process.env.MONDAY_API_KEY;
const FASTCOURIER_API_KEY = process.env.FASTCOURIER_API_KEY;
const FASTCOURIER_API_BASE = 'https://enterprise.fastcourier.com.au/api';

// 🧠 Get address details from Monday.com
async function getAddressesFromMonday(itemId) {
  const query = `
    query {
      items(ids: ${itemId}) {
        name
        column_values {
          id
          text
        }
      }
    }
  `;

  const res = await axios.post(
    'https://api.monday.com/v2',
    { query },
    {
      headers: {
        Authorization: MONDAY_API_TOKEN,
        'Content-Type': 'application/json'
      }
    }
  );

  const columns = res.data.data.items[0].column_values;
  const getCol = (id) => columns.find((col) => col.id === id)?.text || '';

  return {
    pickup: getCol('pickup_address'),
    drop: getCol('drop_address')
  };
}

// 🚚 Send to FastCourier API
async function createFastCourierJob({ pickup, drop }) {
  const body = {
    pickup_address: pickup,
    drop_address: drop,
    job_type: 'standard', // adjust as needed
    reference: `JOB-${Date.now()}`
  };

  const response = await axios.post(`${FASTCOURIER_API_BASE}/bookings`, body, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${FASTCOURIER_API_KEY}`
    }
  });

  return response.data;
}

// 🛠️ Route: Create shipment
app.post('/create-shipment/:itemId', async (req, res) => {
  try {
    const itemId = req.params.itemId;

    const addresses = await getAddressesFromMonday(itemId);
    if (!addresses.pickup || !addresses.drop) {
      return res.status(400).json({ error: 'Missing pickup or drop address' });
    }

    const result = await createFastCourierJob(addresses);
    res.status(200).json({ message: 'Shipment created', result });
  } catch (err) {
    console.error('Error creating shipment:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to create shipment' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
