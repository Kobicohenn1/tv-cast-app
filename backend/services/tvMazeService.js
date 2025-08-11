const axios = require('axios');
const cache = require('../cache/cache');
const { TV_MAZE_API_URL, CACHE_TTL_MS } = require('../config/default');

/**
 * Fetches data from the TV Maze API
 * Maps the response to return only the relevant fields (id, name, birthday, gender).
 */
const fetchFromAPI = async () => {
  try {
    const response = await axios.get(TV_MAZE_API_URL);
    return response.data.map((item) => ({
      id: item.person.id,
      name: item.person.name,
      birthday: item.person.birthday,
      gender: item.person.gender,
    }));
  } catch (error) {
    console.log('[fetchFromAPI] Error fetching data:', error.message);
    const status = error.response?.status || 503;
    const message = 'Failed to fetch data from TV Maze API';
    throw { status, message };
  }
};

/**
 * Retrieves the cast data from cache or fetches it from the API if the cache is invalid.
 * If data is fetched from the API, it will be saved in the cache.
 */
const getCast = async () => {
  try {
    const cached = cache.get();
    if (cached) {
      return cached;
    }
    const data = await fetchFromAPI();
    cache.set(data);
    return data;
  } catch (error) {
    console.log('[getCast] Error retrieving data:', error.message);
    const status = error.status || 500;
    const message = error.message || 'Failed to get cast data';
    throw { status, message };
  }
};

/**
 * Preloads the cache with the initial cast data by fetching from the API.
 * Called to ensure cache is populated before starting auto-refresh.
 */
const preloadCache = async () => {
  try {
    const data = await fetchFromAPI();
    cache.set(data);
    console.log('[preloadCache] Cache preloaded successfully.');
  } catch (error) {
    console.log('[preloadCache] Failed to preload cache:', error.message);
  }
};

/**
 * Starts the auto-refresh cycle.
 * This ensures the cache is preloaded initially and then periodically refreshed.
 */
const startAutoRefresh = async () => {
  try {
    await preloadCache();
    console.log(
      '[auto-refresh] Cache preloaded, starting auto-refresh cycle...'
    );
    cache.startAutoRefresh(fetchFromAPI, CACHE_TTL_MS);
    console.log('[auto-refresh] Auto-refresh started.');
  } catch (error) {
    console.log(
      '[startAutoRefresh] Error starting auto-refresh:',
      error.message
    );
  }
};

module.exports = {
  getCast,
  startAutoRefresh,
};
