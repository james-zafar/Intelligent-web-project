const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const story = new Schema(
    {
        _id: {type: String, required: true},
        text: {type: String, required: true},
        image: [{type: String, data: Buffer}],
        date: {type: Date, default: Date.now},
        keywords: [{type: String}],
        user_id: {type: String},
        votes: [{vote: Number, user_id: mongoose.Schema.Types.ObjectId}]
    }
);

story.set('toObject', {getters: true, virtuals: true});

const userModel = mongoose.model('Story', story);
module.exports = userModel;
