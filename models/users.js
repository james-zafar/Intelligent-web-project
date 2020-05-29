const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        _id: {type: String, required: true},
        first_name: {type: String, required: true, max: 100},
        family_name: {type: String, max: 100},
        email: {type: String, required: true},
        password: {type: String},
        voted_stories: [{rating: Number, storyId: String}]
    }
);

/**
 * Generates hashed password with bcrypt
 * @param password - String to be hashed
 * @returns {string} - Hashed password
 */
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

/**
 * Checks if given password is valid
 * @param password to be checked
 */
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.set('toObject', {getters: true, virtuals: true});

const User = mongoose.model('User', userSchema);
module.exports = User;
