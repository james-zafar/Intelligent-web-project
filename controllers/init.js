const mongoose = require('mongoose');
const fs = require('fs');
const User = require('../models/users');
const Story = require('../models/stories');

exports.init = function() {
    const user = new User({
        _id: Math.random().toString(36).substring(7),
        first_name: 'Mickey',
        family_name: 'Mouse',
        email: 'mickymouse@disney.com',
    });
    user.password = user.generateHash('minnie');
    user.save(function (err, results) {
        console.log(err);
        console.log(results._id);
    });
};