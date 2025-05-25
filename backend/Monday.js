const axios = require('axios');

// Replace these with your actual keys/IDs
const API_KEY = "";
const BOARD_ID = '';   // number
const GROUP_ID = '';  // string

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

async function testMondayQuery() {
  try {
    const res = await axios.post(
      'https://api.monday.com/v2',
      { query },
      { headers: { Authorization: API_KEY, 'Content-Type': 'application/json' } }
    );
    console.log(JSON.stringify(res.data, null, 2));
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testMondayQuery();