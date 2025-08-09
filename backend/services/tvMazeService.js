const axios = require('axios');
const { CACHE_TTL_MS, TV_MAZE_API_URL } = require('../config/default');

const fetchCast = async () => {
  try {
    const response = await axios.get(TV_MAZE_API_URL);
    return response.data;
  } catch (err) {
    console.error('Failed to fetch from TVMaze', err.message);
    throw new Error('Failed to fetch cast data');
  }
};

module.exports = {
  fetchCast,
};
