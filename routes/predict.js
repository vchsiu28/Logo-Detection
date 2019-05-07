const express = require('express');
const router = express.Router();
const predictController = require('../controllers/predict');

router.post('/image', predictController.postImagePred);

module.exports = router;