const express = require('express');
const router = express.Router();
const matchController = require('../controllers/match-controller');

router.post('/init', matchController.matchUsers);

// Route to check match status
router.get('/status', matchController.checkMatchStatus);

module.exports = router;