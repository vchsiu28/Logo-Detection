const jwt = require('jsonwebtoken');
const promisify = require('util').promisify;

const User = require('../models/user');
const HttpError = require('../error').HttpError;

exports.verifyAuthToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token.startsWith('Bearer ')) {
        token = token.slice(7);
    } else {
        return res.status(403).json({
            message: 'Authentication fails: invalid token'
        });
    }
    const secret = req.app.locals.config.secret;
    promisify(jwt.verify)(token, secret)
        .then(payload => {
            req.payload = payload;
            next();
        })
        .catch(() => {
            res.status(403).json({
                message: 'Authentication fails: invalid token'
            });
        });
};

exports.validateSignup = (req, res, next) => {
    let {
        email: email,
        password: password,
        confirmPassword: confirmPassword
    } = req.body;
    email = email.toLowerCase();
    req.email = email;
    const emailRegx = new RegExp(req.app.locals.config.emailRegx);
    const passwordRegx = new RegExp(req.app.locals.config.passwordRegx);
    if (!emailRegx.test(email)) {
        return res.status(400).json({ message: 'Invalid email' });
    }
    if (!passwordRegx.test(password)) {
        return res.status(400).json({
            message:
                'A password must contain at least two of the following: numbers, lowercase letters, or uppercase letters.'
        });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }
    User.findOne({ email: email })
        .then(user => {
            if (user) {
                throw new HttpError(400, 'email already registered');
            }
            next();
        })
        .catch(err => {
            if (err instanceof HttpError) {
                return res
                    .status(err.statusCode)
                    .json({ message: err.message });
            }
            res.status(500).json({ message: err.message });
        });
};
