const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const promisify = require('util').promisify;

const User = require('../models/user');

exports.postSignup = (req, res, next) => {
    const { email: email, password: password } = req.body;
    bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword
            });
            return user.save();
        })
        .then(() => {
            res.status(201).json(user);
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
                res.status(400).json({
                    message: 'Incorrect email or password'
                });
            }
            userId = user._id;
            console.log(userId);
            return bcrypt.compare(password, user.password);
        })
        .then(match => {
            if (match) {
                console.log(userId);
                const secret = req.app.locals.config.secret;
                return promisify(jwt.sign)(
                    { id: userId, email: email },
                    secret,
                    {
                        expiresIn: '24h'
                    }
                );
            }
            res.status(400).json({
                message: 'Incorrect email or password'
            });
        })
        .then(token => {
            res.status(200).json({ token: token });
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
};
