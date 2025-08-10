const axios = require('axios');
const cache = require('../cache/cache');
const { TV_MAZE_API_URL, CACHE_TTL_MS } = require('../config/default');

/**
 * Fetches data from the TV Maze API
 * Maps the response to return only the relevant fields (id, name, birthday, gender).
 */
async function fetchFromAPI() {
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
    throw new Error('Failed to fetch data from API');
  }
}

/**
 * Retrieves the cast data from cache or fetches it from the API if the cache is invalid.
 * If data is fetched from the API, it will be saved in the cache.
 */
async function getCast() {
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
    throw new Error('Failed to get cast data');
  }
}

/**
 * Preloads the cache with the initial cast data by fetching from the API.
 * Called to ensure cache is populated before starting auto-refresh.
 */
async function preloadCache() {
  try {
    const data = await fetchFromAPI();
    cache.set(data);
    console.log('[preloadCache] Cache preloaded successfully.');
  } catch (error) {
    console.log('[preloadCache] Failed to preload cache:', error.message);
  }
}

/**
 * Starts the auto-refresh cycle.
 * This ensures the cache is preloaded initially and then periodically refreshed.
 */
async function startAutoRefresh() {
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
}

module.exports = {
  getCast,
  startAutoRefresh,
};
