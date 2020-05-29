const mongoose = require('mongoose');
const Story = require('../models/stories');
const Users = require('../models/users');
const replaceIDs = require('./getUserNames');

exports.insert = function (req, res) {
    const storyData = req.body;
    if (storyData == null) {
        res.status(403).send('No data sent!')
    }
    try {
        const story = new Story({
            text: storyData.text,
            image: storyData.image,
            date: storyData.date,
            user_id: storyData.user_id,
            votes: storyData.votes
        });
        console.log('received: ' + storyData);

        storyData.save(function (err, results) {
            console.log(results._id);
            if (err)
                res.status(500).send('Invalid data!');

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(story));
        });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
};

exports.getAll = async function (req, res, callback) {
    const storyData = req.body;
    if (storyData == null) {
        res.status(403).send('No data sent!')
    }
    try {
        Story.find({}, async function (err, stories) {
            if (err) {
                // res.status(500).send('Invalid data!');
                return callback(err)
            } else if (!stories) {
                let err = new Error('Stories not found.');
                err.status = 401;
                return callback(err);
            }
            return callback(null, stories);
        });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
};

exports.insertFromJson = function (req, res, callback) {
    const storyData = req.body;
    console.log(storyData);
    if (storyData == null) {
        res.status(403).send('No data sent!')
    }
    try {
        const story = new Story({
            text: storyData.text,
            image: storyData.image,
            date: new Date(),
            user_id: storyData.userId,
            votes: storyData.votes,
            _id: storyData.storyId
        });
        console.log('received: ' + story);

        story.save(function (err, results) {
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

exports.rateStory = function (req, res, callback) {
    const ratingData = req.body;
    if (ratingData == null) {
        res.status(403).send('No data sent!')
    }
    try {
        const filter = {_id: {$eq: ratingData.storyId}};
        console.log(req.session.user._id);
        const update = {$push: {votes: {vote: parseInt(ratingData.rating), user_id: req.session.user._id}}};
        Story.findOneAndUpdate(filter, update, function (err, result) {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result)
        });
    } catch (e) {
        console.log(e);
        return callback(e);
    }
};

/**
 * Rates all stories given correct data from
 * @param req
 * @param res
 * @param callback
 */
exports.rateStories = function (req, res, callback) {
    function runUpdate(rating) {
        return new Promise((resolve, reject) => {
            const filter = {_id: {$eq: rating.storyId}};
            const update = {$push: {votes: {vote: rating.rating, user_id: rating.userId}}};
            Story.findOneAndUpdate(filter, update).then(result => resolve(result)).catch(err => reject(err));
        });
    }
    const ratingsData = req.body;
    let promises = []
    ratingsData.forEach(rating => promises.push(runUpdate(rating)));
    Promise.all(promises).then(result => {
        callback(null, result);
    }).catch(err => {
        callback(err);
    });
};

/**
 * Clear stories collections completely
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
        Story.remove({}, function (err, results) {
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