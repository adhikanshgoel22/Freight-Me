require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 5000;

app.use(express.json());

app.post('/api/ticket', async (req, res) => {
  const { ticketNumber } = req.body;

  const query = `
    query {
      items(ids: ${ticketNumber}) {
        name
        column_values {
          id
          text
        }
      }
    }
  `;

  try {
    const response = await axios.post(
      'https://api.monday.com/v2',
      { query },
      {
        headers: {
          Authorization: process.env.MONDAY_API_KEY,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
