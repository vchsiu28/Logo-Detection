const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const vision = require('@google-cloud/vision');

const config = require('./config.json');
const historyRoutes = require('./routes/history');
const predictRoutes = require('./routes/predict');
const authRoutes = require('./routes/auth');

const app = express();

app.locals.config = config;
app.locals.googleClient = new vision.ImageAnnotatorClient();

app.use(express.static('public'));

app.use(bodyParser.json({ limit: '50mb' }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, PATCH, DELETE, OPTIONS'
    );
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization'
    );
    next();
});

app.use('/history', historyRoutes);
app.use('/predict', predictRoutes);
app.use('/auth', authRoutes);

mongoose
    .connect(config.dbUrl, { useNewUrlParser: true, useFindAndModify: false })
    .then(() => {
        app.listen(8888);
        console.log('Server starts listening on port 8888...');
    })
    .catch(err => {
        console.log(err);
    });
