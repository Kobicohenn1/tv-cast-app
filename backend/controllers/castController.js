const tvMazeService = require('../services/tvMazeService');
const cache = require('../cache/cache');

/**
 * Fetches the cast data either from the cache or by making an API call
 * If the data is in cache and valid, it returns it, otherwise it fetches new data.
 * Responds with the cast data in JSON format, or an error message if fetching fails.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
async function getCast(req, res) {
  try {
    const cast = await tvMazeService.getCast();
    res.json(cast);
  } catch (error) {
    console.error('Failed to fetch cast:', error.message);
    res.status(500).json({ message: 'Failed to fetch cast data' });
  }
}

/**
 * Deletes a player from the cache by their ID.
 * If the player is found in the cache, it deletes the player and sends a success response.
 * If the player is not found, it sends a 404 not found response.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
function deletePlayer(req, res) {
  const { id } = req.params;
  if (cache.deletePlayer(id)) {
    res.status(200).send(`Player with ID ${id} deleted from cache.`);
  } else {
    res.status(404).send('Player not found in cache.');
  }
}

module.exports = {
  getCast,
  deletePlayer,
};
