const express = require('express');
const historyController = require('../controllers/history');
const validator = require('../middleware/validator');

const router = express.Router();

router.get('/user', validator.verifyToken, historyController.getUserHist);

router.post('/user', validator.verifyToken, historyController.postUserHist);

module.exports = router;
