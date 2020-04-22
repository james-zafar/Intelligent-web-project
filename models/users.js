const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        // user_id: {type: String},
        // Not sure if we need this looks like mongoose adds an '_id' property to every schema.
        // Hence why I have mongoose.Schema.Types.ObjectId, which is the type if '_id'
        first_name: {type: String, required: true, max: 100},
        family_name: {type: String, required: true, max: 100},
        email: {type: String, required: true, max: 100},
        password: {type: String},
        voted_stories: [{vote: Boolean, story_id: mongoose.Schema.Types.ObjectId}]
    }
);

// hash the password
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// check if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.set('toObject', {getters: true, virtuals: true});

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;