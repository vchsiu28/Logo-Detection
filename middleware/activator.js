const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');

exports.generateToken = (req, res, next) => {
    const userId = req.payload.userId;
    const token = crypto.randomBytes(32).toString('hex');
    const expire = Date.now() + 3600000;
    User.findOneAndUpdate(
        { _id: userId },
        { $set: { activateToken: token, activateExpire: expire } }
    )
        .then(() => {
            req.payload.token = token;
            return next();
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
};

exports.sendLink = (req, res, next) => {
    const { token: token, statusCode: statusCode } = req.payload;
    const {
        sendgridKey: sendgridKey,
        emailFrom: emailFrom
    } = req.app.locals.config;
    const transporter = nodemailer.createTransport(
        sendgridTransport({
            auth: {
                api_key: sendgridKey
            }
        })
    );
    transporter
        .sendMail({
            to: req.payload.email,
            from: emailFrom,
            subject: 'Activate Your Account',
            html: `
            <p>Thank you for joining our website.</p>
            <p>Click <a href="http://localhost:8888/activate.html?token=${token}">this link</a> to actviate your account. This link will expire after 1h.</p>
        `
        })
        .catch(err => {
            console.log(err);
        });
    res.status(statusCode).json(req.payload);
};
