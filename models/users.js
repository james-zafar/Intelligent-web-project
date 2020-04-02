const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const user = new Schema(
    {
        // user_id: {type: String},
        // Not sure if we need this looks like mongoose adds an '_id' property to every schema.
        // Hence why I have mongoose.Schema.Types.ObjectId, which is the type if '_id'
        first_name: {type: String, required: true, max: 100},
        family_name: {type: String, required: true, max: 100},
        email: {type: String, required: true, max: 100},
        voted_stories: [{vote: Boolean, story_id: mongoose.Schema.Types.ObjectId}]
    }
);

user.set('toObject', {getters: true, virtuals: true});

const userModel = mongoose.model('User', user);
module.exports = userModel;