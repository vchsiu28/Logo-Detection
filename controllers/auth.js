const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const promisify = require('util').promisify;

const User = require('../models/user');
const HttpError = require('../error').HttpError;

exports.postSignUp = (req, res, next) => {
    const { email: email, password: password } = req.body;
    bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
                verified: false
            });
            return user.save();
        })
        .then(user => {
            req.payload = {
                userId: user._id,
                email: user.email,
                statusCode: 201
            };
            next();
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
};

exports.postSignin = (req, res, next) => {
    const { email: email, password: password } = req.body;
    let userId;
    let verified;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                throw new HttpError(400, 'Incorrect email or password');
            }
            userId = user._id;
            verified = user.verified;
            return bcrypt.compare(password, user.password);
        })
        .then(match => {
            if (!match) {
                throw new HttpError(400, 'Incorrect email or password');
            }
            if (!verified) {
                req.payload = { userId: userId, email: email, statusCode: 403 };
                return next();
            }
            const secret = req.app.locals.config.secret;
            return promisify(jwt.sign)(
                { userId: userId, email: email },
                secret,
                {
                    expiresIn: '24h'
                }
            );
        })
        .then(token => {
            if (token) {
                res.status(201).json({ token: token });
            }
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

exports.getIndex = (req, res, next) => {
    res.status(200).json(req.payload);
};

exports.patchActivate = (req, res, next) => {
    const token = req.body.token;
    User.findOne({ activateToken: token })
        .then(user => {
            if (user && user.activateExpire > Date.now()) {
                user.verified = true;
                return new User(user).save();
            }
            throw new HttpError(400, 'Invalid or expired token');
        })
        .then(() => {
            return res.status(200).json({ message: 'Account activated' });
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
