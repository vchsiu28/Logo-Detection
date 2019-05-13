const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');
const validator = require('../middleware/validator');

router.post('/signup', validator.validateSignup, authController.postSignup);

router.post('/signin', authController.postSignin);
