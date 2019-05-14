const express = require('express');
const historyController = require('../controllers/history');
const validator = require('../middleware/validator');

const router = express.Router();

router.get('/user', validator.verifyAuthToken, historyController.getUserHist);

router.post('/user', validator.verifyAuthToken, historyController.postUserHist);

module.exports = router;
