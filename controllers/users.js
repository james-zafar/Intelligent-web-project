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
            // password: userData.password,
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

exports.getByEmail = function (req, res) {
    const userData = req.body;
    if (userData == null) {
        res.status(403).send('No data sent!')
    }
    try {
        User.findOne({email: userData.email}, function (err, user) {
            if (err) {
                res.status(500).send('Invalid data!');
            }
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(user));
        });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
};