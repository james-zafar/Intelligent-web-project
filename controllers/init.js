const mongoose = require('mongoose');
const User = require('../models/users');


exports.init= function() {
    // uncomment if you need to drop the database

    // Character.remove({}, function(err) {
    //    console.log('collection removed')
    // });

    // const dob=new Date(1908, 12, 1).getFullYear();
    const user = new User({
        first_name: 'Mickey',
        family_name: 'Mouse',
        email: 'mickymouse@disney.com'
    });

    user.save(function (err, results) {
        console.log(err);
        console.log(results._id);
    });
};