const express = require('express');
const predictController = require('../controllers/predict');
const validator = require('../middleware/validator');

const router = express.Router();

router.post('/image', validator.verifyAuthToken, predictController.postImagePred);

module.exports = router;
