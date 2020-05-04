const mongoose = require('mongoose');
const fs = require('fs');
const User = require('../models/users');
const Story = require('../models/stories');

exports.init = function() {
    // uncomment if you need to drop the database

    // Character.remove({}, function(err) {
    //    console.log('collection removed')
    // });

    // const dob=new Date(1908, 12, 1).getFullYear();
    const user = new User({
        first_name: 'Mickey',
        family_name: 'Mouse',
        email: 'mickymouse@disney.com',
        // password: this.generateHash('minnie')
    });
    user.password = user.generateHash('minnie');
    user.save(function (err, results) {
        console.log(err);
        console.log(results._id);
    });

    const img = fs.readFileSync('../public/images/dummy_img.png').toString('base64');
    const story = new Story({
        text: 'Test',
        image: Buffer.from(img, 'base64'),
        data: Date.now,
    });
    story.save(function (err, results) {
        console.log(err);
        console.log(results._id);
    });
};