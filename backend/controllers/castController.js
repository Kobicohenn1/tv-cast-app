const tvMazeService = require('../services/tvMazeService');
const { saveComment } = require('../services/fileService');
const cache = require('../cache/cache');

/**
 * Fetches the cast data either from the cache or by making an API call
 * If the data is in cache and valid, it returns it, otherwise it fetches new data.
 * Responds with the cast data in JSON format, or an error message if fetching fails.
 */
const getCast = async (req, res) => {
  try {
    const cast = await tvMazeService.getCast();
    res.json(cast);
  } catch (error) {
    console.error('Failed to fetch cast:', error.message);
    res.status(500).json({ message: 'Failed to fetch cast data' });
  }
};

/**
 * Deletes a player from the cache by their ID.
 * If the player is found in the cache, it deletes the player and sends a success response.
 * If the player is not found, it sends a 404 not found response.
 */
const deletePlayer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: 'Invalid player ID' });
    }

    const deleted = cache.deletePlayer(Number(id));

    if (deleted) {
      return res
        .status(200)
        .json({ message: `Player ${id} deleted successfully` });
    } else {
      return res.status(404).json({ message: 'Player not found' });
    }
  } catch (error) {
    console.error('Error deleting player:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

//Add comment for a specific player with his id
const addComment = async (req, res) => {
  const playerId = req.params.id;
  const { comment } = req.body;

  if (!playerId || !comment) {
    return res
      .status(400)
      .json({ message: 'Player ID and comment are required.' });
  }

  try {
    const players = cache.get();
    const player = players.find((p) => p.id === parseInt(playerId));

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    await saveComment(player, comment);
    return res.status(200).json({ message: 'Comment saved successfully!' });
  } catch (error) {
    console.error('Error saving comment:', error);
    return res.status(500).json({ message: 'Failed to save comment' });
  }
};

module.exports = {
  getCast,
  deletePlayer,
  addComment,
};
