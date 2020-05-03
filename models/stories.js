const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const story = new Schema(
    {
        text: {type: String, required: true},
        image: {type: String, data: Buffer},
        date: {type: Date, default: Date.now},
        user_id: {type: mongoose.Schema.Types.ObjectId}
    }
);

story.set('toObject', {getters: true, virtuals: true});

const userModel = mongoose.model('Story', story);
module.exports = userModel;