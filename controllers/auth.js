const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const promisify = require('util').promisify;

const User = require('../models/user');
const HttpError = require('../error').HttpError;

exports.postSignup = (req, res, next) => {
    const { email: email, password: password } = req.body;
    let user;
    bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
            user = new User({
                email: email,
                password: hashedPassword
            });
            return user.save();
        })
        .then(user => {
            res.status(201).json({ userId: user._id, email: user.email });
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
};

exports.postSignin = (req, res, next) => {
    const { email: email, password: password } = req.body;
    let userId;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                throw new HttpError(400, 'Incorrect email or password');
            }
            userId = user._id;
            return bcrypt.compare(password, user.password);
        })
        .then(match => {
            if (match) {
                const secret = req.app.locals.config.secret;
                return promisify(jwt.sign)(
                    { userId: userId, email: email },
                    secret,
                    {
                        expiresIn: '24h'
                    }
                );
            }
            throw new HttpError(400, 'Incorrect email or password');
        })
        .then(token => {
            if (token) {
                res.status(200).json({ token: token });
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
    res.status(200).json({message: 'Authentication succeeds'})
}