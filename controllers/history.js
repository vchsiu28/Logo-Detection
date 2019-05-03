exports.getUserHist = (req, res, next) => {
    const userId = req.params.userId;
    res.status(202).json({
        message: 'success',
        userId: userId
    })
}