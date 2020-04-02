const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const story = new Schema(
    {
        text: {type: String, required: true},
        user_id: {type: mongoose.Schema.Types.ObjectId, required: true}
    }
);

story.set('toObject', {getters: true, virtuals: true});

const userModel = mongoose.model('Story', story);
module.exports = userModel;