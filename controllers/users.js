const mongoose = require('mongoose');
const User = require('../models/users');

/**
 * Inserts user into db from json file format
 * @param req
 * @param res
 * @param callback
 */
exports.insertFromJson = function (req, res, callback) {
    const userData = req.body;
    // console.log(userData);
    if (userData == null) {
        res.status(403).send('No data sent!')
    }
    try {
        console.log(userData.ratings)
        const user = new User({
            _id: userData.userId,
            first_name: userData.userId,
            email: userData.userId,
            voted_stories: userData.ratings,
        });
        user.password = user.generateHash(userData.userId);
        // console.log('received: ' + user);

        user.save(function (err, results) {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, results);
            // res.setHeader('Content-Type', 'application/json');
            // res.send(JSON.stringify(user));
        });
    } catch (e) {
        console.log(e);
        return callback(e);
    }
};

exports.getByEmail = function (req, res, callback) {
    const userData = req.body;
    if (userData == null) {
        res.status(403).send('No data sent!')
    }
    try {
        User.findOne({email: userData.email}, function (err, user) {
            if (err) {
                // res.status(500).send('Invalid data!');
                return callback(err)
            } else if (!user) {
                let err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(user));
        });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
};

exports.authenticate = function(req, res, callback) {
    const userData = req.body;
    if (userData == null) {
        res.status(403).send('No data sent!')
    }
    console.log(userData);
    try {
        User.findOne({ email: userData.username }, function (err, user) {
            if (err) {
                return callback(err)
            }
            if (!user) {
                let err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            if (!user.validPassword(userData.password)) {
                return callback();
            }
            return callback(null, user);
        });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
};

/**
 * Clear users collections completely
 * @param req
 * @param res
 * @param callback
 * @returns {*}
 */
exports.clearAll = function (req, res, callback) {
    const userData = req.body;
    // console.log(userData);
    if (userData == null) {
        res.status(403).send('No data sent!')
    }
    try {
        User.remove({}, function (err, results) {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, results);
        });
    } catch (e) {
        console.log(e);
        return callback(e);
    }
};

