const express = require('express');
const router = express.Router();
const castController = require('../controllers/castController');

router.get('/cast', castController.getCast); //Route to get the list of cast members.
router.delete('/cast/:id', castController.deletePlayer); //Route to delete a player from the cache by their id

module.exports = router;
