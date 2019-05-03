const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const historySchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    searchResult: {
        type:{
            label: [{ type: String }],
            logo: [{ type: String }],
            web: [{ type: String }]
        },
        required: true
    },
    time: {
        type: Date,
        default: Date()
    }
});

module.exports = mongoose.model('History', historySchema);
