const express = require('express');
const router = express.Router();
const historyController = require('../controllers/history');

router.get('/user/:userId', historyController.getUserHist);

module.exports = router;
