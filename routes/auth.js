const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');
const validator = require('../middleware/validator');
const activator = require('../middleware/activator');

router.post(
    '/signup',
    validator.validateSignup,
    authController.postSignUp,
    activator.generateToken,
    activator.sendLink
);

router.post(
    '/signin',
    authController.postSignin,
    activator.generateToken,
    activator.sendLink
);

router.get('/index', validator.verifyAuthToken, authController.getIndex);

router.patch('/activate', authController.patchActivate);

module.exports = router;
