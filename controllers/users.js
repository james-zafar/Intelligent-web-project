const User = require('../models/users');

var mongodb = require('mongodb');
const mongoose = require('mongoose');


exports.insert = function (req, res) {
    const userData = req.body;
    if (userData == null) {
        res.status(403).send('No data sent!')
    }
    try {
        const user = new User({
            first_name: userData.first_name,
            family_name: userData.family_name,
            email: userData.email,
            password: userData.password,
            voted_stories: userData.voted_stories
        });
        console.log('received: ' + user);

        user.save(function (err, results) {
            console.log(results._id);
            if (err)
                res.status(500).send('Invalid data!');

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(user));
        });
    } catch (e) {
        res.status(500).send('error ' + e);
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

exports.authenticate = function (req, res, callback) {
    const userData = req.body;
    if (userData == null) {
        res.status(403).send('No data sent!')
    }
    console.log(userData);
    try {
        User.findOne({email: userData.username}, function (err, user) {
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

exports.updateRating = function (req, res) {
    const rating = parseInt(req.body.vote);
    var updateSuccess = 1;
    var storyLiked = new mongodb.ObjectID(req.body.story_id);
    var currentUser = new mongodb.ObjectID(req.body.currentUser);
    User.findOne({_id: currentUser}, function (error, user) {
        if (error) {
            console.log("Encountered error... " + error.message);
            return error;
        } else {
            var votes = user.voted_stories;
            (function () {
                votes.forEach(function (current) {
                    if (current['story_id'] === storyLiked) {
                        current['vote'] = rating;
                        updateSuccess = -1;
                        return;
                    }
                });
            })();
            if (rating === -1) {
                //Update complete
                console.log("Rating updated.");
            } else {
                console.log("Creating new rating...");

                var newRating = {};
                newRating['vote'] = rating;
                newRating['story_id'] = storyLiked;
                votes.push(newRating);
                console.log(votes);
                var update = {$set: {voted_stories: votes}};

                User.updateOne({_id: currentUser}, update, function (error, result) {
                    if (error) {
                        console.log("Error adding like...", error);
                        throw error;
                    }
                });
            }
        }
    });
};

