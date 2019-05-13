const jwt = require('jsonwebtoken');
const promisify = require('util').promisify;

exports.verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    } else {
        res.status(403).json({
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
    const {
        email: email,
        password: password,
        confirmPassword: confirmPassword
    } = req.body;
    email = email.toLowerCase();
    req.email = email;
    const emailRegx = new RegExp(req.app.locals.config.emailRegx);
    const passwordRegx = new RegExp(req.app.locals.config.passwordRegx);
    if (!emailRegx.test(email)) {
        res.status(400).json({ message: 'Invalid email' });
    }
    if (!passwordRegx.test(password)) {
        res.status(400).json({message: 'Password too simple'});
    }
    if (password !== confirmPassword) {
        res.status(400).json({message: 'Passwords do not match'});
    }
    next();
};
