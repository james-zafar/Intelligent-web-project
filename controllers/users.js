const User = require('../models/users');

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

