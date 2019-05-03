const express = require('express');
const bodyParser = require('body-parser');
const vision = require('@google-cloud/vision');


const historyRoutes = require('./routes/history');
const predictRoutes = require('./routes/predict');

const app = express();
app.locals.googleClient = new vision.ImageAnnotatorClient();

app.use(express.static('public'));

app.use(bodyParser.json({limit: '50mb'}));

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

app.listen(8888);
