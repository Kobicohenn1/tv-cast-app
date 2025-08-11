const { CACHE_TTL_MS } = require('../config/default');

let data = null; //The data itself
let lastUpdate = 0; //The last time we update
//Flags to check if the loop is running to prevent multiple auto refresh loops or we stop the loop
let loopRunning = false;
let loopStop = false;
let io = null; //Socket.IO server instance

function setIO(socketIO) {
  //Give the Socket.io server instance so this cache can emit to clients
  io = socketIO;
}

function isValid() {
  //Returns true if we have a data and it not expired
  return data && Date.now() - lastUpdate < CACHE_TTL_MS;
}

/**
 * Replace the cache with new data and updata the timestamp
 * Also emits the cache-ttl-updated if the Socke.IO is connected
 */

function set(newData) {
  if (!newData) throw new Error('Cannot set empty data to cache');
  data = newData;
  lastUpdate = Date.now();
  if (io) {
    // Notify connected clients that the cache was refreshed
    io.emit('cache-ttl-updated', {
      timestamp: Date.now(),
      message: 'Cache refreshed after TTL',
    });
  }
}

//Return the data if valid else returns null
function get() {
  if (isValid()) {
    return data;
  }
  return null;
}

/**
 * Remove a player from the cache by id
 * This effects only the cache when the cache refresh the player will comeback
 */
function deletePlayer(playerId) {
  if (!data) return false;

  const before = data.length;
  data = data.filter((item) => item.id !== Number(playerId));

  return data.length < before;
}

/**
 * loops and
 */
async function refreshLoop(fetcher, intervalMs = CACHE_TTL_MS) {
  if (loopRunning) {
    console.log('[cache] Auto-refresh already running...');
    return;
  }

  loopRunning = true;
  loopStop = false;

  await new Promise((resolve) => setTimeout(resolve, intervalMs));

  while (!loopStop) {
    const start = Date.now();
    try {
      console.log('[cache] Starting auto-refresh cycle...');
      const freshData = await fetcher();
      set(freshData);
      console.log('[cache] Cache refreshed with new data.');
    } catch (err) {
      console.error('[cache] auto-refresh failed:', err.message);
    }
    const elapsed = Date.now() - start;
    const wait = Math.max(0, intervalMs - elapsed);
    await new Promise((resolve) => setTimeout(resolve, wait));
  }

  loopRunning = false;
}

function startAutoRefresh(fetcher, intervalMs = CACHE_TTL_MS) {
  if (loopRunning) return;
  refreshLoop(fetcher, intervalMs);
}

function stopAutoRefresh() {
  loopStop = true;
}

module.exports = {
  get,
  set,
  deletePlayer,
  startAutoRefresh,
  stopAutoRefresh,
  setIO,
};
