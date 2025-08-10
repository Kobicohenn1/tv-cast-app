const { CACHE_TTL_MS } = require('../config/default');

//Data in the cache
let data = null;
//Last updatae of the cache
let lastUpdate = 0;
//flags if the loop is running and flag for stop the loop
let _loopRunning = false;
let _loopStop = false;

/**
 * Function to check if the cache is still valid
 * Cache is considered valid if the time now - the last update is less then the CACHE_TTL_MS
 * @returns {boolean} - Weather the cache is valid
 */
function isValid() {
  return data && Date.now() - lastUpdate < CACHE_TTL_MS;
}

/**
 *Function to set a new data in the cache
 * Throws an error if the data is empty
 * @param {Array} newData - The new data in the cache
 */
function set(newData) {
  if (!newData) throw new Error('Cannot set empty data to cache');
  data = newData;
  lastUpdate = Date.now(); //Update the timestamp of the last caceh
}

/**
 *Function to retrive the data from the cache if its valid
 * @returns {Array|null} - Returns the data if the cache is valid,else returns null
 */
function get() {
  if (isValid()) {
    return data;
  }
  return null;
}

/**
 *Function to delete a player from the cache using the player id
 * @param {*} playerId - The id of the player to remove
 * @returns {boolean} - Wether the player was removed from the cache
 */
function deletePlayer(playerId) {
  if (!data) return false;

  const before = data.length;
  data = data.filter((item) => item.id !== Number(playerId));

  return data.length < before;
}

/**
 * The main auto-refresh loop
 * Fetches a fresh data and updates the cache based on the CACHE_TTL_MS
 * @param {*} fetcher - The function that fetch data from the API
 * @param {*} intervalMs - The time interval in milliseconds
 */
async function _refreshLoop(fetcher, intervalMs = CACHE_TTL_MS) {
  if (_loopRunning) {
    console.log('[cache] Auto-refresh already running...');
    return; //If the loop is already running ,prevent starting new one
  }

  _loopRunning = true;
  _loopStop = false;

  // Infinite loop that refreshes the cache until stopped
  while (!_loopStop) {
    const start = Date.now();
    try {
      console.log('[cache] Starting auto-refresh cycle...');
      const freshData = await fetcher();
      set(freshData);
      console.log(freshData);
      console.log('[cache] Cache refreshed with new data.');
    } catch (err) {
      console.error('[cache] auto-refresh failed:', err.message);
    }
    const elapsed = Date.now() - start;
    const wait = Math.max(0, intervalMs - elapsed); // Calculate how long to wait before the next refresh cycle
    await new Promise((resolve) => setTimeout(resolve, wait)); // Wait before starting the next cycle
  }

  _loopRunning = false; // When the loop is stopped, reset the state
}

/**
 * Start the auto refresh cycle
 * If the loop is not running ,it start the refresh loop function
 * @param {*} fetcher - The function that fetch data from the API
 * @param {*} intervalMs - The time interval in milliseconds
 */

function startAutoRefresh(fetcher, intervalMs = CACHE_TTL_MS) {
  if (_loopRunning) return;
  _refreshLoop(fetcher, intervalMs);
}

/**
 * Stops the auto-refresh cycle.
 */
function stopAutoRefresh() {
  _loopStop = true;
}

module.exports = {
  get,
  set,
  deletePlayer,
  startAutoRefresh,
  stopAutoRefresh,
};
