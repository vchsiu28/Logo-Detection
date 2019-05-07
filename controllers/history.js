const History = require('../models/history');

exports.getUserHist = (req, res, next) => {
    const userId = req.params.userId;
    History.find({ userId: userId }, ['searchResult', 'time'], {
        sort: { time: -1 }
    })
        .then(histories => {
            res.status(200).json(histories);
        })
        .catch(err => {
            // For debug only
            res.status(500).json({ message: err.message });
        });
};

exports.postUserHist = (req, res, next) => {
    const { userId: userId, searchResult: searchResult, time: time } = req.body;
    const history = new History({
        userId: userId,
        searchResult: searchResult,
        time: time
    });
    history
        .save()
        .then(() => {
            res.status(201).json({ message: 'Success' });
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
};
